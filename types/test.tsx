// TypeScript Version: 3.0

import {
  Match,
  Redirect,
  Route,
  createBrowserRouter,
  createConnectedRouter,
  createRender,
  makeRouteConfig,
  resolver,
} from 'found';
// Just test that these imports work.
import _1 from 'found/HttpError';
import _2 from 'found/RedirectException';
import _3 from 'found/createRender';
import _4 from 'found/makeRouteConfig';
import * as React from 'react';

const render = createRender({
  renderError: ({ error, context: _context }) => {
    switch (error.status) {
      case 404:
        return (
          <div>
            <h3>Couldn’t find page</h3>
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
  getData(): any {
    // Ignored.
  }
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
    <Redirect from="/baz" to="/foo" />
    <Redirect from="/quz" to={() => ({ pathname: '/foo', other: 9 })} />
  </Route>,
);

// $ExpectError
<Route path="/baz/:id" getComponent={() => Promise.resolve(null)} />;

// $ExpectError
<Route path="/baz/:id" getComponent={() => 'string'} />;

const BrowserRouter = createBrowserRouter({
  render,
  routeConfig,
});

createBrowserRouter({
  render,
  routeConfig,
  // $ExpectError
  historyProtocol: {},
});

<BrowserRouter />;
<BrowserRouter resolver={createResolver()} />;
<BrowserRouter matchContext="foo" />;
