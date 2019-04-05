import delay from 'delay';
import MemoryProtocol from 'farce/lib/MemoryProtocol';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

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
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await resolver.done;
    await delay(10);

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'bar');
  }

  it('should support static redirects', async () => {
    await assertRedirect(
      new Redirect({
        from: '/foo',
        to: '/bar',
      }),
    );
  });

  it('should support function redirects', async () => {
    await assertRedirect(
      new Redirect({
        from: '/foo',
        to: ({ location }) => location.pathname.replace('foo', 'bar'),
      }),
    );
  });

  it('should support throwing RedirectException in route render method', async () => {
    await assertRedirect({
      path: '/foo',
      render: () => {
        throw new RedirectException('/bar');
      },
    });
  });
});
