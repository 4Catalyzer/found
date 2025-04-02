
import ServerProtocol from 'farce/ServerProtocol';
import pDefer from 'p-defer';
import React from 'react';
import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import createFarceRouter from '../src/createFarceRouter';
import { getTestRenderer } from './helpers';
describe('render', () => {
  it('should support nested routes', async () => {
    const deferred = pDefer();

    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo/baz/a'),
      routeConfig: [
        {
          path: 'foo',
          getComponent: async () => {
            await deferred.promise;
            return ({ children }) => <div className="foo">{children}</div>;
          },
          children: [
            {
              path: 'bar',
              Component: () => <div className="bar" />,
            },
            {
              path: 'baz/:qux',
              Component: ({ match }) => (
                <div className="baz">{match.params.qux}</div>
              ),
            },
          ],
        },
      ],

      renderPending: () => <div className="pending" />,
    });

    const { resolver, testRenderer } = await getTestRenderer(Router);
    
    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="pending"
      />
    `);

    await act(async () => {
      deferred.resolve();
      await resolver.done;
    })


    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="foo"
      >
        <div
          className="baz"
        >
          a
        </div>
      </div>
    `);
   
  });

  it('should support named child routes', async () => {
    const deferred = pDefer();

    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo/bar/qux/a'),
      routeConfig: [
        {
          path: 'foo',
          getComponent: async () => {
            await deferred.promise;
            return ({ nav, main }) => (
              <div className="foo">
                {nav}
                {main}
              </div>
            );
          },
          children: [
            {
              path: 'bar',
              children: {
                nav: [
                  {
                    path: '(.*)?',
                    Component: () => <div className="bar-nav" />,
                  },
                ],
                main: [
                  {
                    path: 'baz',
                    Component: () => <div className="baz" />,
                  },
                  {
                    path: 'qux/:quux',
                    Component: ({ match }) => (
                      <div className="qux">{match.params.quux}</div>
                    ),
                  },
                ],
              },
            },
          ],
        },
      ],

      renderPending: () => <div className="pending" />,
    });

    const { resolver, testRenderer } = await getTestRenderer(Router);

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="pending"
      />
    `);

    await act(async () => {
      deferred.resolve();
      await resolver.done;
    })

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="foo"
      >
        <div
          className="bar-nav"
        />
        <div
          className="qux"
        >
          a
        </div>
      </div>
    `);
  });

  it('should support route render method returning a function', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          render: () => (children) => <div className="foo">{children}</div>,
          children: [
            {
              render:
                () =>
                ({ nav, main }) =>
                  (
                    <div className="bar">
                      {nav}
                      {main}
                    </div>
                  ),
              children: {
                nav: [
                  {
                    render: () => <div className="baz" />,
                  },
                ],
                main: [
                  {
                    render: () => () => null,
                    children: [
                      {
                        render: () => () => <div className="qux" />,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    });


    const { resolver, testRenderer } = await getTestRenderer(Router);

    await act(() => resolver.done);

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="foo"
      >
        <div
          className="bar"
        >
          <div
            className="baz"
          />
        </div>
      </div>
    `);
  });

  it('should support custom renderReady', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: 'foo',
          render: () => null,
        },
      ],

      renderReady: () => <div className="ready" />,
    });

    const { resolver, testRenderer } = await getTestRenderer(Router);

    await act(() => resolver.done);

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="ready"
      />
    `);
  });

  it('should support fully custom render', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: 'foo',
          render: () => null,
        },
      ],

      render: () => <div className="rendered" />,
    });


    const { resolver, testRenderer } = await getTestRenderer(Router);

    await act(() => resolver.done);

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="rendered"
      />
    `);
  });

});
