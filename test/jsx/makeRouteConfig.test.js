import React from 'react';

import makeRouteConfig from '../../src/jsx/makeRouteConfig';
import Redirect from '../../src/jsx/Redirect';
import Route from '../../src/jsx/Route';
import RedirectObject from '../../src/Redirect';

const AppPage = () => {};
const MainPage = () => {};
const FooPage = () => {};
const BarPage = () => {};

describe('makeRouteConfig', () => {
  it('should work with a route', () => {
    expect(makeRouteConfig(
      <Route path="/" Component={AppPage} />,
    )).toEqual([
      {
        path: '/',
        Component: AppPage,
      },
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
      {
        path: '/',
        Component: AppPage,
        children: [
          new RedirectObject({
            from: 'widget/:widgetId',
            to: '/widgets/:widgetId',
          }),
        ],
      },
    ]);
  });
});
