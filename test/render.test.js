import ServerProtocol from 'farce/lib/ServerProtocol';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import createFarceRouter from '../src/createFarceRouter';
import createRender from '../src/createRender';

import { timeout, InstrumentedResolver } from './helpers';

describe('render', () => {
  it('should support nested routes', async () => {
    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo/baz/a'),
      routeConfig: [
        {
          path: 'foo',
          getComponent: async () => {
            await timeout(20);
            return ({ children }) => <div className="foo">{children}</div>;
          },
          children: [
            {
              path: 'bar',
              Component: () => <div className="bar" />,
            },
            {
              path: 'baz/:qux',
              Component: ({ params }) => (
                <div className="baz">{params.qux}</div>
              ),
            },
          ],
        },
      ],

      render: createRender({
        renderPending: () => <div className="pending" />,
      }),
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    // Initial pending render is asynchronous.
    await timeout(10);

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
            await timeout(20);
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
                    Component: ({ params }) => (
                      <div className="qux">{params.quux}</div>
                    ),
                  },
                ],
              },
            },
          ],
        },
      ],

      render: createRender({
        renderPending: () => <div className="pending" />,
      }),
    });

    const resolver = new InstrumentedResolver();
    const instance = ReactTestUtils.renderIntoDocument(
      <Router resolver={resolver} />,
    );

    // Initial pending render is asynchronous.
    await timeout(10);

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
});
