import FarceActions from 'farce/lib/Actions';
import BrowserProtocol from 'farce/lib/BrowserProtocol';
import createHistoryEnhancer from 'farce/lib/createHistoryEnhancer';
import queryMiddleware from 'farce/lib/queryMiddleware';
import createConnectedRouter from 'found/lib/createConnectedRouter';
import createMatchEnhancer from 'found/lib/createMatchEnhancer';
import createRender from 'found/lib/createRender';
import foundReducer from 'found/lib/foundReducer';
import Link from 'found/lib/Link';
import Matcher from 'found/lib/Matcher';
import Redirect from 'found/lib/Redirect';
import resolver from 'found/lib/resolver';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, compose, createStore } from 'redux';

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
  children: PropTypes.node,
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

const routeConfig = [
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
      new Redirect({
        from: 'baz',
        to: '/foo',
      }),
    ],
  },
];

const store = createStore(
  combineReducers({
    found: foundReducer,
  }),
  compose(
    createHistoryEnhancer({
      protocol: new BrowserProtocol(),
      middlewares: [queryMiddleware],
    }),
    createMatchEnhancer(
      new Matcher(routeConfig),
    ),
  ),
);

store.dispatch(FarceActions.init());

const ConnectedRouter = createConnectedRouter({
  render: createRender({
    renderError: ({ error }) => ( // eslint-disable-line react/prop-types
      <div>
        {error.status === 404 ? 'Not found' : 'Error'}
      </div>
    ),
  }),
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter resolver={resolver} />
  </Provider>,
  document.getElementById('root'),
);
