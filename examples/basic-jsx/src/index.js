import createBrowserRouter from 'found/lib/createBrowserRouter';
import Link from 'found/lib/Link';
import makeRouteConfig from 'found/lib/jsx/makeRouteConfig';
import Redirect from 'found/lib/jsx/Redirect';
import Route from 'found/lib/jsx/Route';
import React from 'react';
import ReactDOM from 'react-dom';

function LinkItem(props) {
  // TODO: Remove the pragma once evcohen/eslint-plugin-jsx-a11y#81 ships.
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
  routeConfig: makeRouteConfig(
    <Route
      path="/"
      Component={App}
    >
      <Route
        Component={() => <div>Main</div>}
      />
      <Route
        path="foo"
        Component={() => <div>Foo</div>}
      />
      <Route
        path="bar"
        getComponent={() => new Promise((resolve) => {
          setTimeout(resolve, 1000, ({ data }) => <div>{data}</div>);
        })}
        getData={() => new Promise((resolve) => {
          setTimeout(resolve, 1000, 'Bar');
        })}
        render={({ Component, props }) => (
          Component && props ? (
            <Component {...props} />
          ) : (
            <div><small>Loading&hellip;</small></div>
          )
        )}
      />
      <Redirect
        from="baz"
        to="/foo"
      />
    </Route>
  ),

  renderError: error => (
    <div>
      {error.status === 404 ? 'Not found' : 'Error'}
    </div>
  ),
});

ReactDOM.render(
  <BrowserRouter />,
  document.getElementById('root'),
);
