import React from 'react';

import Redirect from '../src/Redirect';
import RedirectException from '../src/RedirectException';
import Route from '../src/Route';
import makeRouteConfig from '../src/makeRouteConfig';

describe('makeRouteConfig', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = () => <div />;
  const AppPage = noop;

  const MainPage = noop;
  const FooPage = noop;
  const BarPage = noop;
  const BazPage = noop;

  const FooNav = noop;
  const FooA = noop;
  const FooB = noop;
  const BarNav = noop;
  const BarMain = noop;

  it('should work with a route', () => {
    expect(makeRouteConfig(<Route path="/" Component={AppPage} />)).toEqual([
      new Route({
        path: '/',
        Component: AppPage,
      }),
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
      new Route({
        path: '/',
        Component: AppPage,
        children: [
          new Route({
            Component: MainPage,
          }),
          new Route({
            path: 'foo',
            Component: FooPage,
            children: [
              new Route({
                path: 'bar',
                Component: BarPage,
              }),
            ],
          }),
        ],
      }),
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
      new Route({
        path: '/',
        Component: AppPage,
        children: [
          new Route({
            Component: MainPage,
          }),
          new Route({
            path: 'foo',
            Component: FooPage,
          }),
          new Route({
            path: 'bar',
            Component: BarPage,
          }),
          new Route({
            path: 'baz',
            Component: BazPage,
          }),
        ],
      }),
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
      new Route({
        path: '/',
        Component: AppPage,
        children: [
          new Redirect({
            from: 'widget/:widgetId',
            to: '/widgets/:widgetId',
          }),
        ],
      }),
    ]);
  });

  it('should work with named child routes', () => {
    expect(
      makeRouteConfig(
        <Route path="/" Component={AppPage}>
          <Route path="foo">
            {{
              nav: <Route path="(.*)?" Component={FooNav} />,
              main: [
                <Route path="a" Component={FooA} />,
                <Route path="b" Component={FooB} />,
              ],
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

  ['react-proxy', 'react-stand-in'].forEach((packageName) => {
    it(`should work with proxies from ${packageName}`, () => {
      // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
      const createProxy = require(packageName).default;

      const ProxiedRedirect = createProxy(Redirect).get();
      const redirect = makeRouteConfig(
        <ProxiedRedirect from="/foo" to="/bar" />,
      )[0];

      expect(Object.getPrototypeOf(redirect)).toBe(Redirect.prototype);

      expect(redirect.path).toBe('/foo');
      expect(redirect.to).toBe('/bar');
      expect(redirect.render).toBeTruthy();

      let redirectException;

      try {
        redirect.render?.({
          match: {
            router: {
              matcher: {
                format: (to) => to,
              },
            },
          } as any,
        });
      } catch (e) {
        redirectException = e;
      }

      expect(redirectException).toBeInstanceOf(RedirectException);
      expect(redirectException.location).toBe('/bar');
      expect(redirectException.status).toBe(302);
    });
  });
});
