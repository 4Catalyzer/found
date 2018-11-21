// TypeScript Version: 3.0

import * as React from 'react';

import {
  createConnectedRouter,
  createRender,
  createBrowserRouter,
  makeRouteConfig,
  Route,
  resolver,
  HttpError,
  Match,
} from 'found';

import _1 from 'found/lib/HttpError';
import _2 from 'found/lib/RedirectException';
import _3 from 'found/lib/makeRouteConfig';
import _4 from 'found/lib/createRender';

const render = createRender({
  renderError: ({ error, context }) => {
    switch (error.status) {
      case 404:
        return (
          <div>
            <h3>Couldn't find page</h3>
          </div>
        );
      case 401:
        return 'Unauthorized';
      default:
        return null;
    }
  },
});

const createResolver = () => ({
  ...resolver,
  resolveElements(match: Match) {
    return resolver.resolveElements(match);
  },
});

const ConnectedRouter = createConnectedRouter({
  render,
});

class Api {
  getData(): any {}
}

<ConnectedRouter
  resolver={createResolver()}
  matchContext={{ api: new Api() }}
/>;

function Component() {
  return null;
}

function Component2() {
  return <div />;
}

const routeConfig = makeRouteConfig(
  <Route getData={({ context }) => context.api.getData()}>
    <Route path="/" Component={Component} />
    <Route path="/foo/:id" getComponent={() => Promise.resolve(Component2)} />
    <Route path="/bar/:id" getComponent={() => Component2} />
  </Route>,
);

// $ExpectError
<Route path="/baz/:id" getComponent={() => Promise.resolve(null)} />;

// $ExpectError
<Route path="/baz/:id" getComponent={() => 'string'} />;

const browserRouter = createBrowserRouter({
  render,
  routeConfig,
});

const BrowserRouter = createBrowserRouter({
  render,
  routeConfig,
  // $ExpectError
  historyProtocol: {},
});

<BrowserRouter />;
<BrowserRouter resolver={createResolver()} />;
<BrowserRouter matchContext={'foo'} />;
