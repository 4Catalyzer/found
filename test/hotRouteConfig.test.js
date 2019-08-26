import delay from 'delay';
import ServerProtocol from 'farce/lib/ServerProtocol';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import createFarceRouter from '../src/createFarceRouter';
import createRender from '../src/createRender';
import hotRouteConfig from '../src/hotRouteConfig';

import { InstrumentedResolver } from './helpers';

describe('hotRouteConfig', () => {
  afterEach(() => {
    /* eslint-env browser */
    // eslint-disable-next-line no-underscore-dangle
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
    const testRenderer = TestRenderer.create(<Router resolver={resolver} />);

    await resolver.done;

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="foo"
      />
    `);

    await act(async () => {
      hotRouteConfig([
        {
          path: '/foo',
          render: () => <div className="bar" />,
        },
      ]);

      await delay(10);
    });

    await resolver.done;

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="bar"
      />
    `);
  });
});
