import delay from 'delay';
import FarceActions from 'farce/Actions';
import MemoryProtocol from 'farce/MemoryProtocol';
import ServerProtocol from 'farce/ServerProtocol';
import pDefer from 'p-defer';
import React, { useEffect } from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import HttpError from '../src/HttpError';
import RedirectException from '../src/RedirectException';
import { RouterContextState } from '../src/RouterContext';
import createFarceRouter from '../src/createFarceRouter';
import useRouter from '../src/useRouter';
import withRouter from '../src/withRouter';
import { InstrumentedResolver } from './helpers';

describe('Router', () => {
  it('should render match', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          render: () => <div className="foo" />,
        },
      ],
    });

    const resolver = new InstrumentedResolver();
    const testRenderer = TestRenderer.create(<Router resolver={resolver} />);

    await resolver.done;

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="foo"
      />
    `);

    testRenderer.unmount();
  });

  it('should render 404 when no routes match', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [],

      renderError: ({ error }) => <div className={`error-${error.status}`} />,
    });

    const resolver = new InstrumentedResolver();
    const testRenderer = TestRenderer.create(<Router resolver={resolver} />);

    await delay(10);

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="error-404"
      />
    `);
  });

  it('should support throwing HttpError in route render method', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          render: () => {
            throw new HttpError(404);
          },
        },
      ],

      renderError: ({ error }) => <div className={`error-${error.status}`} />,
    });

    const resolver = new InstrumentedResolver();
    const testRenderer = TestRenderer.create(<Router resolver={resolver} />);

    await resolver.done;
    await delay(10);

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="error-404"
      />
    `);
  });

  it('should support reloading the route configuration', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          getData: async () => {
            await delay(10);
          },
          render: () => <div className="foo" />,
        },
      ],
    }) as React.ForwardRefRenderFunction<any, any>;
    const storeRef = React.createRef<any>();
    const resolver = new InstrumentedResolver();
    const testRenderer = TestRenderer.create(
      <Router ref={storeRef} resolver={resolver} />,
    );

    await resolver.done;

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="foo"
      />
    `);

    await act(async () => {
      storeRef.current.found.replaceRouteConfig([
        {
          path: '/foo',
          getData: async () => {
            await delay(10);
          },
          render: () => <div className="bar" />,
        },
      ]);

      await delay(10);
    });

    await resolver.done;

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="bar"
      />
    `);
  });

  describe('context', () => {
    async function getTestRenderer(Component) {
      const Router = createFarceRouter({
        historyProtocol: new MemoryProtocol('/foo'),
        routeConfig: [
          {
            path: '/foo',
            render: () => <Component />,
          },
          {
            path: '/foo/bar',
            render: () => <div className="bar" />,
          },
        ],
      });

      const resolver = new InstrumentedResolver();
      const testRenderer = TestRenderer.create(<Router resolver={resolver} />);

      await resolver.done;

      await act(async () => {
        await delay(10);
      });

      await resolver.done;

      return testRenderer;
    }

    it('should provide router context for useRouter', async () => {
      function MyComponent() {
        const { match, router } = useRouter();

        useEffect(() => {
          router.push(`${match!.location.pathname}/bar`);
        });

        return null;
      }

      const testRenderer = await getTestRenderer(MyComponent);
      expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
        <div
          className="bar"
        />
      `);
    });

    it('should provide router context for withRouter', async () => {
      class MyComponent extends React.Component {
        componentDidMount() {
          const { match, router } = this.props as RouterContextState;

          router.push(`${match!.location.pathname}/bar`);
        }

        render() {
          return null;
        }
      }

      const testRenderer = await getTestRenderer(withRouter(MyComponent));
      expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
        <div
          className="bar"
        />
      `);
    });
  });

  describe('stale match resolution', () => {
    it('should not render stale location', async () => {
      const Component = jest.fn(() => null);
      const deferred = pDefer();

      const Router = createFarceRouter({
        historyProtocol: new MemoryProtocol('/foo'),
        routeConfig: [
          {
            path: '/foo',
            Component,
            getData: () => deferred.promise,
          },
          {
            path: '/bar',
            render: () => <div className="bar" />,
          },
        ],
      }) as React.ForwardRefRenderFunction<any, any>;

      const resolver = new InstrumentedResolver();
      const storeRef = React.createRef<any>();

      const testRenderer = TestRenderer.create(
        <Router ref={storeRef} resolver={resolver} />,
      );

      await act(async () => {
        storeRef.current.dispatch(FarceActions.push('/bar'));
        await delay(10);

        await resolver.done;

        deferred.resolve();
        await delay(10);
      });

      expect(Component).not.toHaveBeenCalled();
      expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
        <div
          className="bar"
        />
      `);
    });

    it('should not run stale redirect', async () => {
      const Component = jest.fn(() => null);
      const deferred1 = pDefer();
      const deferred2 = pDefer();
      const deferreds = [deferred1, deferred2];

      const Router = createFarceRouter({
        historyProtocol: new MemoryProtocol('/foo'),
        routeConfig: [
          {
            path: '/foo',
            getData: () => deferreds.shift()!.promise,
            render: () => <div className="foo" />,
          },
          {
            path: '/bar',
            Component,
          },
        ],
      });

      const resolver1 = new InstrumentedResolver();
      const testRenderer = TestRenderer.create(
        <Router resolver={resolver1} />,
      );

      await delay(10);

      await act(async () => {
        const resolver2 = new InstrumentedResolver();
        testRenderer.update(<Router resolver={resolver2} />);
        await delay(10);

        deferred2.resolve();
        await resolver2.done;

        deferred1.reject(new RedirectException('/bar'));
        await resolver1.done;
      });

      expect(Component).not.toHaveBeenCalled();
      expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
        <div
          className="foo"
        />
      `);
    });
  });
});
