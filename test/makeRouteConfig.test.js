import React from 'react';

import makeRouteConfig from '../src/makeRouteConfig';
import Redirect from '../src/Redirect';
import Route from '../src/Route';

const AppPage = () => {};
const MainPage = () => {};
const FooPage = () => {};
const BarPage = () => {};

describe('makeRouteConfig', () => {
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
});
