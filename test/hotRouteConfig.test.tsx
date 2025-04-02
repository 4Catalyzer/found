import delay from 'delay';
import ServerProtocol from 'farce/ServerProtocol';
import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import createFarceRouter from '../src/createFarceRouter';
import createRender from '../src/createRender';
import hotRouteConfig from '../src/hotRouteConfig';
import { InstrumentedResolver } from './helpers';

describe('hotRouteConfig', () => {
  afterEach(() => {
    /* eslint-env browser */
    // @ts-expect-error - window.__FOUND_HOT_RELOAD__ is a dynamic property
    delete window.__FOUND_HOT_RELOAD__;
    /* eslint-env browser: false */
  });

  it('should reload the route configuration', async () => {
    const routeConfig = hotRouteConfig([
      {
        path: '/foo',
        render: () => <div className="foo" />,
      },
    ]);

    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig,
      render: createRender({}),
    });

    const resolver = new InstrumentedResolver();
    const { container } = render(<Router resolver={resolver} />);

    await act(() => resolver.done);

    expect(container.firstChild).toHaveClass('foo');

    await act(() => {
      hotRouteConfig([
        {
          path: '/foo',
          render: () => <div className="bar" />,
        },
      ]);
      return delay(10);
    });

    await act(() => resolver.done);

    expect(container.firstChild).toHaveClass('bar');
  });
});
