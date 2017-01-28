# Found [![Travis][build-badge]][build] [![npm][npm-badge]][npm]

_Extensible route-based routing for React applications._

Found is a router for [React](https://facebook.github.io/react/) applications with a focus on power and extensibility. Found uses static route configurations. This enables efficient code splitting and data fetching with nested routes. Found also offers extensive control over indicating those loading states, even for routes with code bundles that have not yet been downloaded.

Found is designed to be extremely customizable. Most pieces of Found such as the path matching algorithm and the route element resolution can be fully replaced. This allows [extensions](#extensions) such as [Found Relay](https://github.com/4Catalyzer/found-relay) to provide first-class support for different use cases.

Found uses [Redux](http://redux.js.org/) for state management and [Farce](https://github.com/4Catalyzer/farce) for controlling browser navigation. It can integrate with your existing store and connected components.

## Usage

```js
import { createBrowserRouter, HttpError } from 'found';
import { makeRouteConfig, Redirect, Route } from 'found/lib/jsx';

/* ... */

const BrowserRouter = createBrowserRouter({
  routeConfig: makeRouteConfig(
    <Route
      path="/"
      Component={AppPage}
    >
      <Route
        Component={MainPage}
      />
      <Route
        path="widgets"
      >
        <Route
          Component={WidgetsPage}
          getData={fetchWidgets}
        />
        <Route
          path="widgets/:widgetId"
          getComponent={() => (
            System.import('./WidgetPage').then(module => module.default)
          )}
          getData={({ params: { widgetId } }) => (
            fetchWidget(widgetId).catch(() => { throw new HttpError(404); })
          )}
          render={({ Component, props }) => (
            Component && props ? (
              <Component {...props} />
            ) : (
              <div><small>Loading</small></div>
            )
          )}
        />
      </Route>
      <Redirect
        from="widget/:widgetId"
        to="/widgets/:widgetId"
      />
    </Route>
  ),

  renderError: ({ error }) => (
    <div>
      {error.status === 404 ? 'Not found' : 'Error'}
    </div>
  ),
});

ReactDOM.render(
  <BrowserRouter />,
  document.getElementById('root'),
);
```

This configuration will set up the following routes:

- `/`
  - This renders `<AppPage><MainPage /></AppPage>`
- `/widget`
  - This renders `<AppPage><WidgetsPage /><AppPage>`
  - This will load the data for `<WidgetsPage>` when the user navigates to this route
  - This will continue to render the previous routes while the data for `<WidgetsPage>` are loading
- `/widgets/${widgetId}` (e.g. `/widgets/foo`)
  - This renders `<AppPage><WidgetPage /></AppPage>`
  - This will load the code and data for `<WidgetPage>` when the user navigates to this route
  - This will render the text "Loading" in place of `<WidgetPage>` while the code and data for `<WidgetPage>` are loading
- `/widget/${widgetId}` (e.g. `/widget/foo`)
  - This redirects to `/widgets/${widgetId}`, then renders as above

```js
// AppPage.js

import { Link } from 'found';
import React from 'react';

function AppPage({ children }) {
  return (
    <div>
      <ul>
        <li>
          <Link to="/" activeClassName="active" exact>
            Main
          </Link>
        </li>
        <li>
          <Link to="/widgets/foo" activeClassName="active">
            Foo widget
          </Link>
        </li>
      </ul>

      {children}
    </div>
  );
}

export default AppPage;
```

## Examples

- [Basic usage](/examples/basic)
- [Basic usage with JSX route configuration](/examples/basic-jsx)
- [Global pending state](/examples/global-pending)
- [Transition hook usage](/examples/transition-hook)
- [Server-side rendering](/examples/universal)
- [Named components](/examples/named-components)

## Extensions

- [Found Scroll](https://github.com/4Catalyzer/found-scroll): scroll management
- [Found Relay](https://github.com/4Catalyzer/found-relay): [Relay](https://facebook.github.io/relay/) integration

## Guide

### Installation

```
$ npm i -S react
$ npm i -S found
```

### Basic usage

Define a route configuration as an array of objects, or with the JSX configuration components and the `makeRouteConfig` function in `found/lib/jsx`.

```js
const routeConfig = [
  {
    path: '/',
    Component: AppPage,
    children: [
      {
        Component: MainPage,
      },
      {
        path: 'foo',
        Component: FooPage,
        children: [
          {
            path: 'bar',
            Component: BarPage,
          },
        ],
      },
    ],
  },
];

// This is equivalent:
const jsxRouteConfig = makeRouteConfig(
  <Route path="/" Component={AppPage}>
    <Route Component={MainPage} />
    <Route path="foo" Component={FooPage}>
      <Route path="bar" Component={BarPage} />
    </Route>
  </Route>
);
```

Create a router using your route configuration. For a basic router that uses the HTML5 History API, use `createBrowserRouter`.

```js
const BrowserRouter = createBrowserRouter({ routeConfig });
```

Render this router component into the page.

```js
ReactDOM.render(
  <BrowserRouter />,
  document.getElementById('root'),
);
```

In components rendered by the router, use `<Link>` to render links that navigate when clicked and display active state.

```js
<Link to="/foo" activeClassName="active">
  Foo
</Link>
```

### Route configuration

A route object under the default matching algorithm and route element resolver consists of 4 properties, all of which are optional:

- `path`: a string defining the pattern for the route
- `Component` or `getComponent`: the component for the route, or a method that returns the component for the route
- `data` or `getData`: additional data for the route, or a method that returns additional data for the route
- `render`: a method that returns the element for the route
- `children`: an array of child route objects; if using JSX configuration components, this comes from the JSX children

A route configuration consists of an array of route objects. You can also define a route configuration using the JSX configuration components and the `makeRouteConfig` function in `found/lib/jsx`.

#### `path`

Specify a `path` pattern to control the paths for which a route is active. These patterns are handled using [Path-to-RegExp](https://github.com/pillarjs/path-to-regexp) and follow the rules there. Both named and unnamed parameters will be captured in `params` and `routeParams` as below. The following are common patterns:

- `/path/subpath`
  - Matches `/path/subpath`
- `/path/:param`
  - Matches `/path/foo` with `params` of `{ param: 'foo' }`
- `/path/:(\d+)regexParam`
  - Matches `/path/123` with `params` of `{ regexParam: '123' }`
  - Does not match `/path/foo`
- `/path/:optionalParam?`
  - Matches `/path/foo` with `params` of `{ optionalParam: 'foo' }`
  - Matches `/path` with `params` of `{ optionalParam: undefined }`
- `/path/*`
  - Matches `/path/foo/bar`

Routes are matched based on their `path` properties in a depth-first manner, where `path` on the route must match the prefix of the remaining current path. Routing continues through any routes that do not have `path` set. To configure a default or "index" route, use a route with no `path`.

#### `Component` or `getComponent`

Define the component for a route using either a `Component` field or a `getComponent` method. `Component` should be a component class or function. `getComponent` should be a function that returns a component class or function, or a promise that resolves to either of those. Routes that specify neither will still match if applicable, but will not have a component associated with them.

Given the following route configuration:

```js
const routes = makeRouteConfig(
  <Route path="/" Component={AppPage}>
    <Route Component={MainPage}>
      <Route Component={MainSection} />
      <Route path="other" Component={OtherSection} />
    </Route>
    <Route path="widgets">
      <Route Component={WidgetsPage} />
      <Route path=":widgetId" Component={WidgetPage} />
    </Route>
  </Route>
);
```

The router will have routes as follows:

- `/`, rendering:

```js
<AppPage>
  <MainPage>
    <MainSection />
  </MainPage>
</AppPage>
```

- `/other`, rendering:

```js
<AppPage>
  <MainPage>
    <OtherSection />
  </MainPage>
</AppPage>
```

- `/widgets`, rendering:

```js
<AppPage>
  <WidgetsPage />
</AppPage>
```

- `/widgets/${widgetId}` (e.g. `/widgets/foo`), rendering:

```js
<AppPage>
  <WidgetPage />
</AppPage>
```

By default, route components receive additional props describing the current routing state. These include:

- `location`: the current [location object](https://github.com/4Catalyzer/farce#locations-and-location-descriptors)
- `params`: the union of path parameters for all matched routes
- `routes`: an array of all matched route objects
- `route`: the route object corresponding to this component
- `routeParams`: the path parameters for `route`
- `match`: an object with `location` and `params` as properties, conforming to the `matchShape` prop type validator
- `router`: an object with static router properties, conforming to the `routerShape` prop type validator
  - `push(location)`: navigates to a new location
  - `replace(location)`: replaces the existing history entry
  - `go(delta)`: moves `delta` steps in the history stack
  - `isActive(match, location, { exact })`: for `match` as above, returns whether `match` corresponds to `location` or a subpath of `location`; if `exact` is set, returns whether `match` corresponds exactly to `location`
  - `matcher`: an object implementing the matching algorithm
    - `format(pattern, params)`: returns the path string for a pattern of the same format as a route `path` and a object of the corresponding path parameters
  - `addTransitionHook(hook)`: adds a [transition hook](https://github.com/4Catalyzer/farce#transition-hooks) that can [block navigation](#blocking-navigation)

The `getComponent` method receives an object containing these properties as its argument.

#### `data` or `getData`

Specify the `data` property or `getData` method to inject data into a route component as the `data` prop. `data` can be any value. `getData` can be any value, or a promise that resolves to any value. `getData` receives an object containing the routing state, as described above.

The `getData` method is intended for loading additional data from your back end for a given route. By design, all requests for asynchronous component and data dependencies will be issued in parallel. Found uses static route configurations specifically to enable issuing these requests in parallel.

If you need additional context such as a store instance to fetch data, specify this as the `matchContext` prop to your router. This context value will then be available as the `context` property on the argument to `getData`.

```js
const route = {
  path: 'widgets/:widgetId',
  Component: WidgetPage,
  getData: ({ params, context }) => (
    context.store.dispatch(Actions.getWidget(params.widgetId))
  ),
}

// <Router matchContext={{ store }} />
```

It does not make sense to specify `data` or `getData` if the route does not have a component as above or a `render` method as below.

#### `render`

Specify the `render` method to further customize how the route renders. This method should return a React element to render that element, `undefined` if it has a pending asynchronous component or data dependency and is not ready to render, or `null` to render no component. It receives an object with the following properties:

- `match`: the routing state object, as above
- `Component`: the component for the route, if any; `null` if the component has not yet been loaded
- `props`: the default props for the route component, specifically `match` with `data` as an additional property; `null` if `data` have not yet been loaded
- `data`: the data for the route, as above; `null` if the data have not yet been loaded

You can use this method to render per-route loading state.

```js
function render({ Component, props }) {
  if (!Component || !props) {
    return <LoadingIndicator />;
  }

  return <Component {...props} />;
}
```

If any matched routes have unresolved asynchronous component or data dependencies, the router will initially attempt to render all such routes in their loading state. If those routes all implement `render` methods and return non-`undefined` values from their `render` methods, the router will render the matched routes in their loading states. Otherwise, the router will continue to render the previous set of routes until all asynchronous dependencies resolve.

#### Redirects

The `Redirect` route class and the `<Redirect>` configuration component set up static redirect routes. These take `from` and `to` properties. `from` should be a path pattern as for normal routes above. `to` can be either a path pattern or a function. If it is a path pattern, the router will populate path parameters appropriately. If it is a function, it will receive the same routing state object as `getComponent` and `getData`, as described above.

```js
const redirect1 = new Redirect({
  from: 'widget/:widgetId',
  to: '/widgets/:widgetId',
});

const redirect2 = new Redirect({
  from: 'widget/:widgetId',
  to: ({ params }) => `/widgets/${params.widgetId}`,
});

const jsxRedirect1 = (
  <Redirect
    from="widget/:widgetId"
    to="/widgets/:widgetId"
  />
);

const jsxRedirect2 = (
  <Redirect
    from="widget/:widgetId"
    to={({ params }) => `/widgets/${params.widgetId}`}
  />
);
```

If you need more custom control over redirection, throw a `RedirectException` in your route's `render` method with a [location descriptor](https://github.com/4Catalyzer/farce#locations-and-location-descriptors) for the redirect destination.

```js
const customRedirect = {
  getData: fetchRedirectInfo,
  render: ({ data }) => {
    if (data) {
      throw new RedirectException(data.redirectLocation);
    }
  },
}
```

#### Error handling

The `HttpError` class signals handled router-level error states. This error class takes a status value that should be an integer corresponding to an HTTP error code and an optional data value of any type. You can handle these errors and render appropriate error feedback in the router-level render method described below.

```js
throw new HttpError(status, data);
```

The router will throw a `new HttpError(404)` in the case when no routes match the current location. Otherwise, you can throw `HttpError` instances in the `getComponent`, `getData`, and `render` methods to signal error states.

```js
const route = {
  path: 'widgets/:widgetId',
  Component: WidgetPage,
  getData: ({ params: { widgetId } }) => (
    fetchWidget(widgetId).catch(() => { throw new HttpError(404); })
  ),
};
```

### Router configuration

Found exposes a number of router component class factories at varying levels of abstraction. These factories accept the static configuration properties for the router, such as the route configuration. The use of static configuration allows for efficient, parallel data fetching and state management as above.

#### `createBrowserRouter`

`createBrowserRouter` creates a basic router component class that uses the HTML5 History API for navigation. This factory uses reasonable defaults that should fit a variety use cases.

```js
import { createBrowserRouter } from 'found';

/* ... */

const BrowserRouter = createBrowserRouter({
  routeConfig,

  renderError: ({ error }) => (
    <div>
      {error.status === 404 ? 'Not found' : 'Error'}
    </div>
  ),
});

ReactDOM.render(
  <BrowserRouter />,
  document.getElementById('root'),
);
```

`createBrowserRouter` takes an options object. The only mandatory property on this object is `routeConfig`, which should be a route configuration as above.

The options object also accepts a number of optional properties:

- `historyMiddlewares`: an array of Farce history middlewares; by default, an array containing only `queryMiddleware`
- `historyOptions`: additional configuration options for the Farce history store enhancer
- `renderPending`: a custom render function called when some routes are not yet ready to render, due to those routes have unresolved asynchronous dependencies and no route-level `render` method for handling the loading state
- `renderReady`: a custom render function called when all routes are ready to render
- `renderError`: a custom render function called if an `HttpError` is thrown while resolving route elements
- `render`: a custom render function called in all cases, superseding `renderPending`, `renderReady`, and `renderError`; by default, this is `createRender({ renderPending, readyReady, renderError })`

The `renderPending`, `renderReady`, `renderError`, and `render` functions receive the routing state object as an argument, with the following additional properties:

- `elements`: if present, an array the resolved elements for the matched routes; the array item will be `null` for routes without elements
- `error`: if present, the `HttpError` object thrown during element resolution with properties describing the error
  - `status`: the status code; this is the first argument to the `HttpError` constructor
  - `data`: additional error data; this is the second argument to the `HttpError` constructor

You should specify a `renderError` function or otherwise handle error states. You can specify `renderPending` and `renderReady` functions to indicate loading state globally; the [global pending state example](/examples/global-pending) demonstrates doing this using a static container.

The created `<BrowserRouter>` accepts an optional `matchContext` prop as described above that injects additional context into the route resolution methods.

#### `createFarceRouter`

`createFarceRouter` exposes additional configuration for customizing navigation management and route element resolution. To enable minimizing bundle size, it omits some defaults from `createBrowserRouter`.

```js
import { BrowserProtocol, queryMiddleware } from 'farce';
import { createFarceRouter, createRender, resolveElements } from 'found';

/* ... */

const FarceRouter = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  routeConfig,

  render: createRender({
    renderError: ({ error }) => (
      <div>
        {error.status === 404 ? 'Not found' : 'Error'}
      </div>
    ),
  }),
});

ReactDOM.render(
  <FarceRouter resolveElements={resolveElements} />,
  document.getElementById('root'),
);
```

The options object for `createFarceRouter` should have a `historyProtocol` property that has a history protocol object. For example, to use the HTML History API as with `createBrowserRouter`, you would provide `new BrowserProtocol()`.

The `createFarceRouter` options object does not have a default for the `render` property. It ignores the `renderPending`, `renderReady`, and `renderError` properties.

The created `<FarceRouter>` manages setting up and providing a Redux store with the appropriate configuration internally. It also requires a `resolveElements` prop with the route element resolution function. For routes configured as above, this should be the `resolveElements` function in this library.

#### `createConnectedRouter`

`createConnectedRouter` creates a router that works with an existing Redux store and provider.

```js
import {
  Actions as FarceActions,
  BrowserProtocol,
  createHistoryEnhancer,
  queryMiddleware,
} from 'farce';
import {
  createConnectedRouter,
  createMatchEnhancer,
  createRender,
  foundReducer,
  Matcher,
  resolveElements,
} from 'found';
import { Provider } from 'react-redux';
import { combineReducers, compose, createStore } from 'redux';

/* ... */

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
    renderError: ({ error }) => (
      <div>
        {error.status === 404 ? 'Not found' : 'Error'}
      </div>
    ),
  }),
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter resolveElements={resolveElements} />
  </Provider>,
  document.getElementById('root'),
);
```

When creating a store for use with the created `<ConnectedRouter>`, you should install the `foundReducer` reducer under the `found` key. You should also use a store enhancer created with `createHistoryEnhancer` from Farce and a store enhancer created with `createMatchEnhancer`, which must go after the history store enhancer. Dispatch `FarceActions.init()` after setting up your store to initialize the event listeners and the initial location for the history store enhancer.

`createConnectedRouter` ignores the `historyProtocol`, `historyMiddlewares`, and `historyOptions` properties on its options object.

`createConnectedRouter` also accepts an optional `getFound` property. If you installed `foundReducer` on a key other than `found`, specify the `getFound` function to retrieve the reducer state.

### Navigation

Found provides a high-level abstractions such as a link component for controlling browser navigation. Under the hood, it delegates to [Farce](https://github.com/4Catalyzer/farce) for implementation, and as such can also be controlled directly via the Redux store.

#### Links

The `<Link>` component renders a link with optional active state indication.

```js
const link1 = (
  <Link to="/widgets/foo" activeClassName="active">
    Foo widget
  </Link>
);

const link2 = (
  <Link
    Component={CustomAnchor}
    to={{
      pathname: '/widgets/bar',
      query: { the: query },
    }}
    activePropName="active"
  >
    Bar widget with query
  </Link>
);
```

`<Link>` accepts the following props:

- `to`: a [location descriptor](https://github.com/4Catalyzer/farce#locations-and-location-descriptors) for the link's destination
- `activeClassName`: if specified, a CSS class to append to the component's CSS classes when the link is active
- `activeStyle`: if specified, a style object to append merge with the component's style object when the link is active
- `activePropName`: if specified, a prop to inject with a boolean value with the link's active state
- `exact`: if specified, the link will only render as active if the current location exactly matches the `to` location descriptor; by default, the link also will render as active on subpaths of the `to` location descriptor

By default, links render `<a>` elements. You can override this by specifying a `Component` prop with the desired element type. If you need to pass in additional props to the custom link component that collide with the names of props used by `<Link>`, specify the optional `childProps` prop as an object containing those props.

A link will navigate per its `to` location descriptor when clicked. You can prevent this navigation by providing an `onClick` handler that calls `event.preventDefault()`.

If you have your own store with `foundReducer` installed on a key other than `found`, use `createConnectedLink` with a options object with a `getFound` function to create a custom link component class, as with `createConnectedRouter` above.

#### Programmatic navigation

The `withRouter` HOC wraps an existing component class or function and injects `match` and `router` props, as on route components above. You can use this HOC to create components that navigate programmatically in event handlers.

```js
const propTypes = {
  match: matchShape.isRequired,
  router: routerShape.isRequired,
};

class MyButton extends React.Component {
  onClick = () => {
    this.props.router.replace('/widgets');
  };

  render() {
    return (
      <button onClick={this.onClick}>
        Current widget: {this.props.match.params.widgetId}
      </button>
    );
  }
}

MyButton.propTypes = propTypes;

export default withRouter(MyButton);
```

If you only need the `router` object, you can access it on React context as `context.router`, with the appropriate `contextTypes` configuration.

If you have your own store with `foundReducer` installed on a key other than `found`, use `createWithRouter` with a options object with a `getFound` function to create a custom HOC, as with `createConnectedLink` above.

#### Blocking navigation

The `router.addTransitionHook` method adds a [transition hook](https://github.com/4Catalyzer/farce#transition-hooks) that can block navigation. This method accepts a transition hook function. It returns a function that removes the transition hook.

```js
class MyForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.dirty = false;

    this.removeTransitionHook = props.router.addTransitionHook(() => (
      this.dirty ?
        'You have unsaved input. Are you sure you want to leave this page?' :
        true
    ));
  }

  componentWillUnmount() {
    this.removeTransitionHook();
  }

  /* ... */
}

export default withRouter(MyForm);
```

The transition hook function receives the location to which the user is attempting to navigate as its argument. Return `true` or `false` from this function to allow or block the transition respectively. Return a string to display a default confirmation dialog to the user. Return a nully value to use the next transition hook if present, or else allow the transition. Return a promise to defer allowing or blocking the transition until the promise resolves; you can use this to display a custom confirmation dialog.

If you want to run your transition hooks when the user attempts to leave the page, set `useBeforeUnload` to `true` in `historyOptions` when creating your router component class, or when creating the Farce history store enhancer. If this option is enabled, your transition hooks will be called with a `null` location when the user attempts to leave the page. In this scenario, the transition hook must return a non-promise value.

The [transition hook usage example](/examples/transition-hook) demonstrates the use of transition hooks in more detail, including the use of the `useBeforeUnload` option.

### Redux integration

Found uses Redux to manage all serializable state. Farce uses Redux actions for navigation. As such, you can also access those serializable parts of the routing state from the store state, and you can navigate by dispatching actions.

To access the current routing state, connect to the `resolvedMatch` property of the `foundReducer` state. To navigate, dispatch the appropriate actions from Farce.

```js
import { Actions as FarceActions } from 'farce';
import { connect } from 'react-redux';

const MyConnectedComponent = connect(
  ({ found: { resolvedMatch } }) => ({
    location: resolvedMatch.location,
    params: resolvedMatch.params,
  }),
  {
    push: FarceActions.push,
  },
)(MyComponent);
```

### Server-side rendering

Found supports server-side rendering for universal applications. Functionality specific to server-side rendering is available in `found/lib/server`.

To render your application on the server, use `getFarceResult`.

```js
import { getFarceResult } from 'found/lib/server';

/* ... */

app.use(async (req, res) => {
  const { redirect, status, element } = await getFarceResult({
    url: req.url,
    routeConfig,
    render,
  });

  if (redirect) {
    res.redirect(302, redirect.url);
    return;
  }

  res.status(status).send(`
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Found Universal Example</title>
</head>

<body>
<div id="root">${ReactDOMServer.renderToString(element)}</div>

<script src="/static/bundle.js"></script>
</body>

</html>
  `);
});
```

`getFarceResult` takes an options object. This object must include the `url` property that is the full path of the current request, along with the `routeConfig` and `render` properties needed to create a Farce router component class normally.

The options object for `getFarceResult` also takes the `historyMiddlewares` and `historyOptions` properties, as above for creating Farce router component classes. This options object also takes optional `matchContext` and `resolveElements` properties, as described above as props for router components. `resolveElements` defaults to the standard `resolveElements` function in this library.

`getFarceResult` returns a promise for an object with the following properties:

- `redirect`: if present, indicates that element resolution triggered a redirect; `redirect.url` contains the full path for the redirect location
- `status`: if there was no redirect, the HTTP status code for the response; this will be `error.status` from any encountered `HttpError`, or 200 otherwise
- `element`: if there was no redirect, the React element corresponding to the router component on the client

This promise resolves when all asynchronous dependencies are available. If your routes require asynchronous data, e.g. from `getData` methods, you may want to dehydrate those data on the server, then rehydrate them on the client, to avoid the client having to request those data again.

#### Server-side rendering with custom Redux store

If you are using server-side rendering, you will need to delay the initial render on the client. In this case, use `createInitialBrowserRouter` or `createInitialFarceRouter` instead of `createBrowserRouter` or `createFarceRouter` respectively.

```js
import { createInitialBrowserRouter } from 'found';

/* ... */

(async () => {
  const BrowserRouter = await createInitialBrowserRouter({
    routeConfig,
    render,
  });

  ReactDOM.render(
    <BrowserRouter />,
    document.getElementById('root'),
  );
})();
```

These behave similarly to their counterparts above, except that the options object for `createInitialBrowserRouter` requires a `render` method, and ignores the `renderPending`, `renderReady`, and `renderError` properties. Additionally, these functions take the initial `matchContext` and `resolveElements` if relevant as properties on the options object, rather than as props.

Found exposes lower-level functionality for doing server-side rendering for use with your own Redux store, as with `createConnectedRouter` above. On both the server, use `getStoreRenderArgs` to get a promise for the arguments to your `render` function, then wrap the rendered elements with a `<RouterProvider>`.

```js
import { getStoreRenderArgs, RedirectException } from 'found';
import { RouterProvider } from 'found/lib/server';

/* ... */

app.use(async (req, res) => {
  /* ... */

  let renderArgs;

  try {
    renderArgs = await getStoreRenderArgs({
      store,
      matchContext,
      resolveElements,
    });
  } catch (e) {
    if (e instanceof RedirectException) {
      res.redirect(302, store.farce.createHref(e.location));
      return;
    }

    throw e;
  }

  res
    .status(renderArgs.error ? renderArgs.error.status : 200)
    .send(renderPageToString(
      <Provider store={store}>
        <RouterProvider router={renderArgs.router}>
          {render(renderArgs)}
        </RouterProvider>
      </Provider>,
      store.getState(),
    ));
});
```

You must dispatch `FarceActions.init()` before calling `getStoreRenderArgs`. `getStoreRenderArgs` takes an options object. This object must have the `store` property for your store and the `resolveElements` property as described above. It supports an optional `matchContext` property as described above as well. `getStoreRenderArgs` returns a promise that resolves to a `renderArgs` object that can be passed into a `render` function as above.

`<RouterProvider>` requires a `router` prop that is the router context object as described above. This is available on `renderArgs.router`, from the value resolved by `getStoreRenderArgs`.

On the client, pass the value resolved by by `getStoreRenderArgs` to your `<ConnectedRouter>` as the `initialRenderArgs` prop.

```js
import { getStoreRenderArgs } from 'found';

/* ... */

(async () => {
  const initialRenderArgs = await getStoreRenderArgs({
    store,
    matchContext,
    resolveElements,
  });

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter
        matchContext={matchContext}
        resolveElements={resolveElements}
        initialRenderArgs={initialRenderArgs}
      />
    </Provider>,
    document.getElementById('root'),
  );
})();
```

### Minimizing bundle size

The top-level `found` package exports everything available in this library. It is unlikely that any single application will use all the features available. As such, for real applications, you should import the modules that you need from `found/lib` directly, to pull in only the code that you use.

```js
import createBrowserRouter from 'found/lib/createBrowserRouter';
import { routerShape } from 'found/lib/PropTypes';
import makeRouteConfig from 'found/lib/jsx/makeRouteConfig';
import Route from 'found/lib/jsx/Route';

// Instead of:
// import { createBrowserRouter, routerShape } from 'found';
// import { makeRouteConfig, Route } from 'found/lib/jsx';
```

[build-badge]: https://img.shields.io/travis/4Catalyzer/found/master.svg
[build]: https://travis-ci.org/4Catalyzer/found

[npm-badge]: https://img.shields.io/npm/v/found.svg
[npm]: https://www.npmjs.org/package/found
