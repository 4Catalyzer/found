import { describe, expect, it } from 'vitest';

import { Route, Redirect, makeRouteConfig } from '../src/jsx';

describe('makeRouteConfig', () => {
  const AppPage = () => null;
  const MainPage = () => null;
  const FooPage = () => null;
  const BarPage = () => null;
  const BazPage = () => null;
  const FooNav = () => null;
  const FooA = () => null;
  const FooB = () => null;
  const BarNav = () => null;
  const BarMain = () => null;

  it('should work with a route', () => {
    expect(makeRouteConfig(<Route path="/" Component={AppPage} />)).toEqual([
      {
        path: '/',
        Component: AppPage,
      },
    ]);
  });

  it('should work with nested routes', () => {
    expect(
      makeRouteConfig(
        <Route path="/" Component={AppPage}>
          <Route Component={MainPage} />
          {/* This comment should be ignored. */}
          <Route path="foo" Component={FooPage}>
            <Route path="bar" Component={BarPage} />
          </Route>
        </Route>,
      ),
    ).toEqual([
      {
        path: '/',
        Component: AppPage,
        children: [
          {
            Component: MainPage,
          },
          {
            path: 'foo',
            Component: FooPage,
            children: [
              {
                path: 'bar',
                Component: BarPage,
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should work with fragments', () => {
    expect(
      makeRouteConfig(
        <Route path="/" Component={AppPage}>
          <Route Component={MainPage} />
          <>
            <Route path="foo" Component={FooPage} />
            <Route path="bar" Component={BarPage} />
          </>
          <Route path="baz" Component={BazPage} />
        </Route>,
      ),
    ).toEqual([
      {
        path: '/',
        Component: AppPage,
        children: [
          {
            Component: MainPage,
          },
          {
            path: 'foo',
            Component: FooPage,
          },
          {
            path: 'bar',
            Component: BarPage,
          },
          {
            path: 'baz',
            Component: BazPage,
          },
        ],
      },
    ]);
  });

  it('should work with <Redirect>', () => {
    expect(
      makeRouteConfig(
        <Route path="/" Component={AppPage}>
          <Redirect from="widget/:widgetId" to="/widgets/:widgetId" />
        </Route>,
      ),
    ).toEqual([
      {
        path: '/',
        Component: AppPage,
        children: [
          {
            path: 'widget/:widgetId',
            to: '/widgets/:widgetId',
            status: undefined,
            render: expect.any(Function),
          },
        ],
      },
    ]);
  });

  it('should work with named child routes', () => {
    expect(
      makeRouteConfig(
        <Route path="/" Component={AppPage}>
          <Route path="foo">
            {{
              nav: <Route path="(.*)?" Component={FooNav} />,
              main: (
                <>
                  <Route path="a" Component={FooA} />
                  <Route path="b" Component={FooB} />
                </>
              ),
            }}
          </Route>
          <Route path="bar">
            {{
              nav: <Route path="(.*)?" Component={BarNav} />,
              main: <Route Component={BarMain} />,
            }}
          </Route>
        </Route>,
      ),
    ).toEqual([
      {
        path: '/',
        Component: AppPage,
        children: [
          {
            path: 'foo',
            children: {
              nav: [
                {
                  path: '(.*)?',
                  Component: FooNav,
                },
              ],
              main: [
                {
                  path: 'a',
                  Component: FooA,
                },
                {
                  path: 'b',
                  Component: FooB,
                },
              ],
            },
          },
          {
            path: 'bar',
            children: {
              nav: [
                {
                  path: '(.*)?',
                  Component: BarNav,
                },
              ],
              main: [
                {
                  Component: BarMain,
                },
              ],
            },
          },
        ],
      },
    ]);
  });

  it('should error on non-element children', () => {
    expect(() => {
      makeRouteConfig(
        <Route path="/" Component={AppPage}>
          {/* The comma below will fail the invariant. */}
          <Route path="foo" Component={FooPage} />,
          <Route path="bar" Component={BarPage} />
        </Route>,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('should allow empty children', () => {
    expect(() => {
      makeRouteConfig(
        <Route path="/" Component={AppPage}>
          {false}
          <Route path="foo" Component={FooPage} />
        </Route>,
      );
    }).not.toThrow();
  });

  it('should error on other falsy children', () => {
    expect(() => {
      makeRouteConfig(
        <Route path="/" Component={AppPage}>
          {0}
          <Route path="foo" Component={FooPage} />
        </Route>,
      );
    }).toThrowErrorMatchingSnapshot();
  });
});
