import createBrowserRouter from 'found/lib/createBrowserRouter';
import Link from 'found/lib/Link';
import RedirectException from 'found/lib/RedirectException';
import React from 'react';
import ReactDOM from 'react-dom';

function LinkItem(props) {
  // TODO: Remove the pragma once evcohen/eslint-plugin-jsx-a11y#81 lands.
  return (
    <li>
      <Link // eslint-disable-line jsx-a11y/anchor-has-content
        {...props}
        activeStyle={{ fontWeight: 'bold' }}
      />
    </li>
  );
}

const propTypes = {
  children: React.PropTypes.node,
};

function App({ children }) {
  return (
    <div>
      <ul>
        <LinkItem to="/">
          Main
        </LinkItem>
        <ul>
          <LinkItem to="/foo">
            Foo
          </LinkItem>
          <LinkItem to="/bar">
            Bar (async)
          </LinkItem>
          <LinkItem to="/baz">
            Baz (redirects to Foo)
          </LinkItem>
          <LinkItem to="/qux">
            Qux (missing)
          </LinkItem>
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
          getComponent: () => new Promise((resolve) => {
            setTimeout(resolve, 1000, ({ data }) => <div>{data}</div>);
          }),
          getData: () => new Promise((resolve) => {
            setTimeout(resolve, 1000, 'Bar');
          }),
          render: ({ Component, props }) => ( // eslint-disable-line react/prop-types
            Component && props ? (
              <Component {...props} />
            ) : (
              <div><small>Loading&hellip;</small></div>
            )
          ),
        },
        {
          path: 'baz',
          render: () => { throw new RedirectException('/foo'); },
        },
      ],
    },
  ],
});

ReactDOM.render(
  <BrowserRouter
    renderError={error => (
      <div>
        {error.status === 404 ? 'Not found' : 'Error'}
      </div>
    )}
  />,
  document.getElementById('root'),
);
