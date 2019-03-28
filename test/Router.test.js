import delay from 'delay';
import MemoryProtocol from 'farce/lib/MemoryProtocol';
import ServerProtocol from 'farce/lib/ServerProtocol';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import createFarceRouter from '../src/createFarceRouter';
import HttpError from '../src/HttpError';
import RedirectException from '../src/RedirectException';

import { InstrumentedResolver } from './helpers';

describe('Router', () => {
  it('should support throwing HttpError in route render method', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          render: () => {
            throw new HttpError(404);
          },
        },
      ],

      renderError: ({ error }) => <div className={`error-${error.status}`} />,
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await resolver.done;
    await delay(10);

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'error-404');
  });

  it('should support throwing RedirectException in route render method', async () => {
    const Router = createFarceRouter({
      historyProtocol: new MemoryProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          render: () => {
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
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await resolver.done;
    await delay(10);

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'bar');
  });

  it('should support reloading the route configuration', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          getData: async () => {
            await delay(20);
          },
          render: () => <div className="foo" />,
        },
      ],
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await resolver.done;

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'foo');
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'bar'),
    ).toHaveLength(0);

    instance.store.found.replaceRouteConfig([
      {
        path: '/foo',
        getData: async () => {
          await delay(10);
        },
        render: () => <div className="bar" />,
      },
    ]);

    await resolver.done;

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'bar');
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'foo'),
    ).toHaveLength(0);
  });
});
