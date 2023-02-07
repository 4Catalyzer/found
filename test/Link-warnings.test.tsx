jest.mock('tiny-warning');

import React from 'react';
import warning from 'tiny-warning';

import Link from '../src/Link';
import { mountWithRouter, noop } from './helpers';

const CustomComponent = () => <div />;

describe('<Link> warnings', () => {
  it('should warn on component prop', async () => {
    // The below will log a warning for an invalid prop.
    jest.spyOn(console, 'error').mockImplementation(noop);

    await mountWithRouter(<Link component={CustomComponent as any} to="/" />);

    expect(warning).toHaveBeenCalledWith(
      false,
      'Link to "/" with `component` prop `CustomComponent` has an element type that is not a component. The expected prop for the link component is `as`.',
    );
  });

  it('should warn on Component prop', async () => {
    // The below will log a warning for an invalid prop.
    jest.spyOn(console, 'error').mockImplementation(noop);

    await mountWithRouter(<Link Component={CustomComponent as any} to="/" />);

    expect(warning).toHaveBeenCalledWith(
      false,
      'Link to "/" with `Component` prop `CustomComponent` has an element type that is not a component. The expected prop for the link component is `as`.',
    );
  });

  it('should not warn when as prop is specified', async () => {
    await mountWithRouter(<Link as={CustomComponent} to="/" />);

    expect(warning).not.toHaveBeenCalledWith(
      false,
      'Link to %s with `%s` prop `%s` has an element type that is not a component. The expected prop for the link component is `as`.',
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  });
});
