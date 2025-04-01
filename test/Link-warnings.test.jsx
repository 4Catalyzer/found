import React from 'react';
import warning from 'tiny-warning';
import { vi } from 'vitest';

import Link from '../src/Link';
import { renderWithRouter } from './helpers';

vi.mock('tiny-warning');

const CustomComponent = () => <div />;

describe('<Link> warnings', () => {
  it('should warn on component prop', async () => {
    // The below will log a warning for an invalid prop.
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await renderWithRouter(<Link component={CustomComponent} to="/" />);

    expect(warning).toHaveBeenCalledWith(
      false,
      'Link to "/" with `component` prop `CustomComponent` has an element type that is not a component. The expected prop for the link component is `as`.',
    );
  });

  it('should warn on Component prop', async () => {
    // The below will log a warning for an invalid prop.
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await renderWithRouter(<Link Component={CustomComponent} to="/" />);

    expect(warning).toHaveBeenCalledWith(
      false,
      'Link to "/" with `Component` prop `CustomComponent` has an element type that is not a component. The expected prop for the link component is `as`.',
    );
  });

  it('should not warn when as prop is specified', async () => {
    await renderWithRouter(
      <Link
        as={CustomComponent}
        to="/"
        component={CustomComponent}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        Component={CustomComponent}
      />,
    );

    expect(warning).not.toHaveBeenCalledWith(
      false,
      'Link to %s with `%s` prop `%s` has an element type that is not a component. The expected prop for the link component is `as`.',
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  });
});
