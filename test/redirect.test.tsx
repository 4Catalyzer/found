import delay from 'delay';
import MemoryProtocol from 'farce/MemoryProtocol';

// @ts-expect-error FIX ME
import TestRenderer, { act } from 'react-test-renderer';
import { describe, expect, it } from 'vitest';

import RedirectException from '../src/RedirectException';
import createFarceRouter from '../src/createFarceRouter';
import { InstrumentedResolver } from './helpers';
import createRedirect from '../src/createRedirect';
import { RouteObject } from '../src/typeUtils';

describe('redirect', () => {
  async function assertRedirect(fooRoute: RouteObject) {
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
      createRedirect({
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
      createRedirect({
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
});
