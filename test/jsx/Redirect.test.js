import React from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';

import Redirect from '../../src/jsx/Redirect';
import RedirectObject from '../../src/Redirect';

describe('<Redirect>', () => {
  it('should create a Redirect object', () => {
    expect(Redirect.createRoute({
      from: 'widget/:widgetId',
      to: '/widgets/:widgetId',
    })).toBeInstanceOf(RedirectObject);
  });

  it('should throw when endered', () => {
    expect(
      () => renderIntoDocument(<Redirect />),
    ).toThrowError(/should not be rendered/);
  });
});
