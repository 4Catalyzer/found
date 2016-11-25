/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import {
  renderIntoDocument,
} from 'react-addons-test-utils';

import Route from '../Route';


it('createRoute should return props directly', () => {
  const App = () => <div>App</div>;
  expect(Route.createRoute({
    path: '/',
    Component: App,
  })).toEqual({
    path: '/',
    Component: App,
  });
});

it('throw when be rendered', () => {
  expect(
    () => renderIntoDocument(<Route />)
  ).toThrowError(/should not be rendered/);
});
