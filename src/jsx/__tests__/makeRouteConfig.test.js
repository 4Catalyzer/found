/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import makeRouteConfig from '../makeRouteConfig';
import Redirect from '../Redirect';
import Route from '../Route';
import RedirectObject from '../../Redirect';


const AppPage = () => <div>AppPage</div>;
const MainPage = () => <div>MainPage</div>;
const FooPage = () => <div>FooPage</div>;
const BarPage = () => <div>BarPage</div>;


it('works with a route', () => {
  expect(makeRouteConfig(
    <Route path="/" Component={AppPage} />
  )).toEqual([
    {
      path: '/',
      Component: AppPage,
    },
  ]);
});

it('works with nested layer', () => {
  expect(makeRouteConfig(
    <Route path="/" Component={AppPage}>
      <Route Component={MainPage} />
      <Route path="foo" Component={FooPage}>
        <Route path="bar" Component={BarPage} />
      </Route>
    </Route>
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

it('works with <Redirect>', () => {
  expect(makeRouteConfig(
    <Route
      path="/"
      Component={AppPage}
    >
      <Redirect
        from="widget/:widgetId"
        to="/widgets/:widgetId"
      />
    </Route>
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
