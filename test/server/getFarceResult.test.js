import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Redirect from '../../src/Redirect';
import RedirectException from '../../src/RedirectException';
import { getFarceResult } from '../../src/server';

async function getRenderedResult(url, routeConfig) {
  const { status, element } = await getFarceResult({ url, routeConfig });
  return [status, ReactDOMServer.renderToString(element)];
}

describe('getFarceResult', () => {
  it('should support nested routes', async () => {
    expect(
      await getRenderedResult('/foo/baz/a', [
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
    ).toMatchInlineSnapshot(`
      Array [
        200,
        "<div class=\\"foo\\"><div class=\\"baz\\">a</div></div>",
      ]
    `);
  });

  it('should support named child routes', async () => {
    expect(
      await getRenderedResult('/foo/bar/qux/a', [
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
    ).toMatchInlineSnapshot(`
      Array [
        200,
        "<div class=\\"foo\\"><div class=\\"bar-nav\\"></div><div class=\\"qux\\">a</div></div>",
      ]
    `);
  });

  it('should support redirects', async () => {
    expect(
      await getFarceResult({
        url: '/foo',
        routeConfig: [
          new Redirect({
            from: 'foo',
            to: '/bar',
          }),
        ],
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "redirect": Object {
          "url": "/bar",
        },
        "status": 302,
      }
    `);
  });

  it('should support custom redirects', async () => {
    expect(
      await getFarceResult({
        url: '/foo',
        routeConfig: [
          {
            path: 'foo',
            render: () => {
              throw new RedirectException('/bar');
            },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "redirect": Object {
          "url": "/bar",
        },
        "status": 302,
      }
    `);
  });

  it('should support redirects with custom status code', async () => {
    expect(
      await getFarceResult({
        url: '/foo',
        routeConfig: [
          new Redirect({
            from: 'foo',
            to: '/bar',
            status: 301,
          }),
        ],
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "redirect": Object {
          "url": "/bar",
        },
        "status": 301,
      }
    `);
  });
});
