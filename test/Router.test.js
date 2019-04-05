import delay from 'delay';
import MemoryProtocol from 'farce/lib/MemoryProtocol';
import ServerProtocol from 'farce/lib/ServerProtocol';
import React, { useEffect } from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import createFarceRouter from '../src/createFarceRouter';
import HttpError from '../src/HttpError';
import useRouter from '../src/useRouter';
import withRouter from '../src/withRouter';

import { InstrumentedResolver } from './helpers';

describe('Router', () => {
  it('should render 404 when no routes match', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [],

      renderError: ({ error }) => <div className={`error-${error.status}`} />,
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await delay(10);

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'error-404');
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
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await resolver.done;
    await delay(10);

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'error-404');
  });

  it('should support reloading the route configuration', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          getData: async () => {
            await delay(20);
          },
          render: () => <div className="foo" />,
        },
      ],
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await resolver.done;

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'foo');
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'bar'),
    ).toHaveLength(0);

    instance.store.found.replaceRouteConfig([
      {
        path: '/foo',
        getData: async () => {
          await delay(10);
        },
        render: () => <div className="bar" />,
      },
    ]);

    await resolver.done;

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'bar');
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'foo'),
    ).toHaveLength(0);
  });

  describe('context', () => {
    async function assertRouterContext(Component) {
      const Router = createFarceRouter({
        historyProtocol: new MemoryProtocol('/foo'),
        routeConfig: [
          {
            path: '/foo',
            Component,
          },
          {
            path: '/foo/bar',
            render: () => <div className="bar" />,
          },
        ],
      });

      const resolver = new InstrumentedResolver();
      const instance = ReactTestUtils.renderIntoDocument(
        <Router resolver={resolver} />,
      );

      await resolver.done;
      await delay(10);
      await resolver.done;

      ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'bar');
    }

    it('should provide router context for useRouter', async () => {
      function MyComponent() {
        const { match, router } = useRouter();

        useEffect(() => {
          router.push(`${match.location.pathname}/bar`);
        });

        return null;
      }

      await assertRouterContext(MyComponent);
    });

    it('should provide router context for withRouter', async () => {
      class MyComponent extends React.Component {
        componentDidMount() {
          const { match, router } = this.props;

          router.push(`${match.location.pathname}/bar`);
        }

        render() {
          return null;
        }
      }

      await assertRouterContext(withRouter(MyComponent));
    });
  });
});
