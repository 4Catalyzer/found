import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import createRender from '../../src/createRender';
import getFarceResult from '../../src/server/getFarceResult';

async function render(url, routeConfig) {
  const { element } = await getFarceResult({
    url,
    routeConfig,
    render: createRender({}),
  });

  return ReactTestUtils.renderIntoDocument(element);
}

describe('getFarceResult', () => {
  it('should support nested routes', async () => {
    const instance = await render('/foo/baz/a', [
      {
        path: 'foo',
        Component: ({ children }) => <div className="foo">{children}</div>,
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
    ]);

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
    const instance = await render('/foo/bar/qux/a', [
      {
        path: 'foo',
        Component: ({ nav, main }) => (
          <div className="foo">
            {nav}
            {main}
          </div>
        ),
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
    ]);

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
