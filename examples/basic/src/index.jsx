import { createBrowserRouter, Link, Redirect } from 'found';
import PropTypes from 'prop-types';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function LinkItem(props) {
  return (
    <li>
      <Link {...props} activeStyle={{ fontWeight: 'bold' }} />
    </li>
  );
}

const propTypes = {
  children: PropTypes.node,
};

function App({ children }) {
  return (
    <div>
      <ul>
        <LinkItem to="/">Main</LinkItem>
        <ul>
          <LinkItem to="/foo">Foo</LinkItem>
          <LinkItem to="/bar">Bar (async)</LinkItem>
          <LinkItem to="/baz">Baz (redirects to Foo)</LinkItem>
          <LinkItem to="/qux">Qux (missing)</LinkItem>
        </ul>
      </ul>

      {children}
    </div>
  );
}

App.propTypes = propTypes;

const BrowserRouter = createBrowserRouter({
  routeConfig: [
    {
      path: '/',
      Component: App,
      children: [
        {
          Component: () => <div>Main</div>,
        },
        {
          path: 'foo',
          Component: () => <div>Foo</div>,
        },
        {
          path: 'bar',
          getComponent: () => import('./Bar').then((m) => m.default),
          getData: () =>
            new Promise((resolve) => {
              setTimeout(resolve, 1000, 'Bar');
            }),
          render: ({ Component, props }) =>
            Component && props ? (
              <Component {...props} />
            ) : (
              <div>
                <small>Loading&hellip;</small>
              </div>
            ),
        },
        new Redirect({
          from: 'baz',
          to: '/foo',
        }),
      ],
    },
  ],

  /* eslint-disable react/prop-types */
  renderError: ({ error }) => (
    <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
  ),
  /* eslint-enable react/prop-types */
});

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter />,
  </StrictMode>,
);
