import React from 'react';

import makeRouteConfig from '../src/makeRouteConfig';
import Redirect from '../src/Redirect';
import Route from '../src/Route';

describe('makeRouteConfig', () => {
  const AppPage = () => {};

  const MainPage = () => {};
  const FooPage = () => {};
  const BarPage = () => {};

  const FooNav = () => {};
  const FooA = () => {};
  const FooB = () => {};
  const BarNav = () => {};
  const BarMain = () => {};

  it('should work with a route', () => {
    expect(makeRouteConfig(
      <Route path="/" Component={AppPage} />,
    )).toEqual([
      new Route({
        path: '/',
        Component: AppPage,
      }),
    ]);
  });

  it('should work with nested routes', () => {
    expect(makeRouteConfig(
      <Route path="/" Component={AppPage}>
        <Route Component={MainPage} />
        <Route path="foo" Component={FooPage}>
          <Route path="bar" Component={BarPage} />
        </Route>
      </Route>,
    )).toEqual([
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

  it('should work with <Redirect>', () => {
    expect(makeRouteConfig(
      <Route
        path="/"
        Component={AppPage}
      >
        <Redirect
          from="widget/:widgetId"
          to="/widgets/:widgetId"
        />
      </Route>,
    )).toEqual([
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
    expect(makeRouteConfig(
      <Route path="/" Component={AppPage}>
        <Route path="foo">
          {{
            nav: (
              <Route path="(.*)?" Component={FooNav} />
            ),
            main: [
              <Route path="a" Component={FooA} />,
              <Route path="b" Component={FooB} />,
            ],
          }}
        </Route>
        <Route path="bar">
          {{
            nav: (
              <Route path="(.*)?" Component={BarNav} />
            ),
            main: (
              <Route Component={BarMain} />
            ),
          }}
        </Route>
      </Route>,
    )).toEqual([{
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
    }]);
  });
});
