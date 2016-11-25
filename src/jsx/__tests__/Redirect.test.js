/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import {
  renderIntoDocument,
} from 'react-addons-test-utils';

import Redirect from '../Redirect';
import RedirectObject from '../../Redirect';


it('createRoute should create a RedirectObject', () => {
  expect(Redirect.createRoute({
    from: 'widget/:widgetId',
    to: '/widgets/:widgetId',
  })).toBeInstanceOf(RedirectObject);
});

it('throw when be rendered', () => {
  expect(
    () => renderIntoDocument(<Redirect />)
  ).toThrowError(/should not be rendered/);
});
