import { Link, LinkProps, Redirect, createBrowserRouter } from 'found';
import { ReactElement, StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';

function LinkItem(props: LinkProps) {
  return createElement(
    'li',
    null,
    createElement(Link, { ...props, activeStyle: { fontWeight: 'bold' } }),
  );
}

function App({ children }: { children: ReactElement[] }) {
  return createElement(
    'div',
    null,
    createElement(
      'ul',
      null,
      createElement(LinkItem, { to: '/' }, 'Main'),
      createElement(
        'ul',
        null,
        createElement(LinkItem, { to: '/foo' }, 'Foo'),
        createElement(LinkItem, { to: '/bar' }, 'Bar (async)'),
        createElement(LinkItem, { to: '/baz' }, 'Baz (redirects to Foo)'),
        createElement(LinkItem, { to: '/qux' }, 'Qux (missing)'),
      ),
    ),
    children,
  );
}

const BrowserRouter = createBrowserRouter({
  routeConfig: [
    {
      path: '/',
      Component: App,
      children: [
        {
          Component: () => createElement('div', null, 'Main'),
        },
        {
          path: 'foo',
          Component: () => createElement('div', null, 'Foo'),
        },
        {
          path: 'bar',
          getComponent: () => import('./Bar').then((m) => m.default),
          getData: () =>
            new Promise((resolve) => {
              setTimeout(resolve, 1000, 'Bar');
            }),
          render: ({ Component, props }) =>
            Component && props
              ? createElement(Component, props)
              : createElement(
                  'div',
                  null,
                  createElement('small', null, 'Loading&hellip;'),
                ),
        },
        new Redirect({
          from: 'baz',
          to: '/foo',
        }),
      ],
    },
  ],

  renderError: ({ error }) =>
    createElement('div', null, error.status === 404 ? 'Not found' : 'Error'),
});

const root = createRoot(document.getElementById('root'));

root.render(
  createElement(StrictMode, null, createElement(BrowserRouter, null)),
);
