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
  main: React.PropTypes.node,
  header: React.PropTypes.node,
};

function App({ main, header }) {
  return (
    <div>
      {header}
      <hr />
      <ul>
        <LinkItem to="/">
          Main
        </LinkItem>
        <ul>
          <LinkItem to="/foo">
            Foo
          </LinkItem>
          <LinkItem to="/foo/123">
            Foo/123
          </LinkItem>
          <LinkItem to="/bar">
            Bar (async)
          </LinkItem>
          <LinkItem to="/baz">
            Baz (redirects to Foo)
          </LinkItem>
        </ul>
      </ul>
      <hr />
      {main}
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
        Component={{
          main: () => <div>Main</div>,
          header: () => <div>Header</div>,
        }}
      />
      <Route
        path="foo"
        Component={{
          main: ({ children }) => <div>Foo<small>{children}</small></div>,
          header: () => <div>Foo Header</div>,
        }}
      >
        <Route
          path=":id"
          Component={({ params }) => <div>{params.id}</div>}
        />
      </Route>
      <Route
        path="bar"
        getComponent={() => new Promise((resolve) => {
          setTimeout(resolve, 1000, {
            main: ({ data }) => <div>{data}</div>,
            header: () => <div>Bar Header</div>,
          });
        })}
        getData={() => new Promise((resolve) => {
          setTimeout(resolve, 1000, { main: 'Bar' });
        })}
        render={({ Component, props }) => (
          Component && props ? (
            { main: <Component.main {...props} data={props.data.main} /> }
          ) : (
            { main: <div><small>Loading&hellip;</small></div> }
          )
        )}
      />
      <Redirect
        from="baz"
        to="/foo"
      />
    </Route>
  ),

  renderError: ({ error }) => ( // eslint-disable-line react/prop-types
    <div>
      {error.status === 404 ? 'Not found' : 'Error'}
    </div>
  ),
});

ReactDOM.render(
  <BrowserRouter />,
  document.getElementById('root'),
);
