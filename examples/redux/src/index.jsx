import FarceActions from 'farce/Actions';
import BrowserProtocol from 'farce/BrowserProtocol';
import createHistoryEnhancer from 'farce/createHistoryEnhancer';
import queryMiddleware from 'farce/queryMiddleware';
import {
  createRedirect,
  Matcher,
  Link,
  createBaseRouter,
  createMatchEnhancer,
  createRender,
  foundReducer,
  resolver,
} from 'found';

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { shallowEqual, useSelector, useStore } from 'react-redux';
import { Store } from 'redux';

import createBaseRouter from './createBaseRouter';


function LinkItem(props) {
  return (
    <li>
      <Link {...props} activeStyle={{ fontWeight: 'bold' }} />
    </li>
  );
}

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
        getComponent: () =>
          new Promise((resolve) => {
            setTimeout(resolve, 1000, ({ data }) => <div>{data}</div>);
          }),
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
      createRedirect({
        from: 'baz',
        to: '/foo',
      }),
    ],
  },
];

const store = configureStore({
  reducer: {
    found: foundReducer,
  },
  enhancers: [
    createHistoryEnhancer({
      protocol: new BrowserProtocol(),
      middlewares: [queryMiddleware],
    }),
    createMatchEnhancer(new Matcher(routeConfig)),
  ],
});

store.dispatch(FarceActions.init());


const Router = createBaseRouter({
  render: createRender({
    renderError: ({ error }) => (
      <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
    ),
  }),
});

const getFoundState = (state) => {
  return state.found
};

function ConnectedRouter(props) {
  const store = useStore();
  const foundState = useSelector(getFoundState, shallowEqual);

  return <Router {...props} {...foundState} store={store} />;
}

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Provider store={store}>
      <ConnectedRouter resolver={resolver} />
    </Provider>
  </StrictMode>,
);
