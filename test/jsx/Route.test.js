import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';

import Route from '../../src/jsx/Route';

describe('<Route>', () => {
  it('should create a route object', () => {
    const App = () => {};

    expect(Route.createRoute({
      path: '/',
      Component: App,
    })).toEqual({
      path: '/',
      Component: App,
    });
  });

  it('should throw when rendered', () => {
    expect(
      () => renderIntoDocument(<Route />)
    ).toThrowError(/should not be rendered/);
  });
});
