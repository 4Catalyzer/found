import delay from 'delay';
import MemoryProtocol from 'farce/lib/MemoryProtocol';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import createFarceRouter from '../src/createFarceRouter';
import Redirect from '../src/Redirect';
import RedirectException from '../src/RedirectException';

import { InstrumentedResolver } from './helpers';

describe('redirect', () => {
  async function assertRedirect(fooRoute) {
    const Router = createFarceRouter({
      historyProtocol: new MemoryProtocol('/foo'),
      routeConfig: [
        fooRoute,
        {
          path: '/bar',
          render: () => <div className="bar" />,
        },
      ],
    });

    const resolver = new InstrumentedResolver();
    const testRenderer = TestRenderer.create(<Router resolver={resolver} />);

    await resolver.done;

    // Let the redirect actually run.
    await act(async () => {
      await delay(10);
    });

    return testRenderer;
  }

  it('should support static redirects', async () => {
    const testRenderer = await assertRedirect(
      new Redirect({
        from: '/foo',
        to: '/bar',
      }),
    );

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="bar"
      />
    `);
  });

  it('should support function redirects', async () => {
    const testRenderer = await assertRedirect(
      new Redirect({
        from: '/foo',
        to: ({ location }) => location.pathname.replace('foo', 'bar'),
      }),
    );

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="bar"
      />
    `);
  });

  it('should support throwing RedirectException in route render method', async () => {
    const testRenderer = await assertRedirect({
      path: '/foo',
      render: () => {
        throw new RedirectException('/bar');
      },
    });

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="bar"
      />
    `);
  });

  it('should support throwing RedirectException in component', async () => {
    const Router = createFarceRouter({
      historyProtocol: new MemoryProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          Component: () => {
            throw new RedirectException('/bar');
          },
        },
        {
          path: '/bar',
          render: () => <div className="bar" />,
        },
      ],
    });

    const resolver = new InstrumentedResolver();
    const testRenderer = TestRenderer.create(<Router resolver={resolver} />);

    await resolver.done;
    await resolver.done;
    await delay(10);
    await delay(10);
    await delay(10);

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`null`);
  });
});
