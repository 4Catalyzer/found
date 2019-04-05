import delay from 'delay';
import ServerProtocol from 'farce/lib/ServerProtocol';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import createFarceRouter from '../src/createFarceRouter';

import { InstrumentedResolver } from './helpers';

describe('render', () => {
  it('should support nested routes', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo/baz/a'),
      routeConfig: [
        {
          path: 'foo',
          getComponent: async () => {
            await delay(20);
            return ({ children }) => <div className="foo">{children}</div>;
          },
          children: [
            {
              path: 'bar',
              Component: () => <div className="bar" />,
            },
            {
              path: 'baz/:qux',
              Component: ({ match }) => (
                <div className="baz">{match.params.qux}</div>
              ),
            },
          ],
        },
      ],

      renderPending: () => <div className="pending" />,
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    // Initial pending render is asynchronous.
    await delay(10);

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'pending');

    await resolver.done;

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'foo');
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'bar'),
    ).toHaveLength(0);

    const bazNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'baz',
    );
    expect(bazNode.textContent).toBe('a');
  });

  it('should support named child routes', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo/bar/qux/a'),
      routeConfig: [
        {
          path: 'foo',
          getComponent: async () => {
            await delay(20);
            return ({ nav, main }) => (
              <div className="foo">
                {nav}
                {main}
              </div>
            );
          },
          children: [
            {
              path: 'bar',
              children: {
                nav: [
                  {
                    path: '(.*)?',
                    Component: () => <div className="bar-nav" />,
                  },
                ],
                main: [
                  {
                    path: 'baz',
                    Component: () => <div className="baz" />,
                  },
                  {
                    path: 'qux/:quux',
                    Component: ({ match }) => (
                      <div className="qux">{match.params.quux}</div>
                    ),
                  },
                ],
              },
            },
          ],
        },
      ],

      renderPending: () => <div className="pending" />,
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    // Initial pending render is asynchronous.
    await delay(10);

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'pending');

    await resolver.done;

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'foo');
    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'bar-nav');

    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'baz'),
    ).toHaveLength(0);

    const quxNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'qux',
    );
    expect(quxNode.textContent).toBe('a');
  });

  it('should support route render method returning a function', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: '/foo',
          render: () => children => <div className="foo">{children}</div>,
          children: [
            {
              render: () => ({ nav, main }) => (
                <div className="bar">
                  {nav}
                  {main}
                </div>
              ),
              children: {
                nav: [
                  {
                    render: () => <div className="baz" />,
                  },
                ],
                main: [
                  {
                    render: () => () => null,
                    children: [
                      {
                        render: () => () => <div className="qux" />,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await resolver.done;

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'foo');
    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'bar');
    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'baz');
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'qux'),
    ).toHaveLength(0);
  });

  it('should support custom renderReady', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: 'foo',
          render: () => null,
        },
      ],

      renderReady: () => <div className="ready" />,
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await resolver.done;
    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'ready');
  });

  it('should support fully custom render', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig: [
        {
          path: 'foo',
          render: () => null,
        },
      ],

      render: () => <div className="rendered" />,
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    await resolver.done;
    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'rendered');
  });
});
