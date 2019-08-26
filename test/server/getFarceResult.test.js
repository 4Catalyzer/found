import React from 'react';
import ReactDOMServer from 'react-dom/server';

import createRender from '../../src/createRender';
import getFarceResult from '../../src/server/getFarceResult';

async function renderToString(url, routeConfig) {
  const { element } = await getFarceResult({
    url,
    routeConfig,
    render: createRender({}),
  });

  return ReactDOMServer.renderToString(element);
}

describe('getFarceResult', () => {
  it('should support nested routes', async () => {
    expect(
      await renderToString('/foo/baz/a', [
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
      ]),
    ).toMatchInlineSnapshot(
      `"<div class=\\"foo\\"><div class=\\"baz\\">a</div></div>"`,
    );
  });

  it('should support named child routes', async () => {
    expect(
      await renderToString('/foo/bar/qux/a', [
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
      ]),
    ).toMatchInlineSnapshot(
      `"<div class=\\"foo\\"><div class=\\"bar-nav\\"></div><div class=\\"qux\\">a</div></div>"`,
    );
  });
});
