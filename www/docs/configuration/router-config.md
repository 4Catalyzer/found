---
sidebar_position: 2
---

# Router configuration

Found exposes a number of router component class factories at varying levels of abstraction. These factories accept the static configuration properties for the router, such as the route configuration. The use of static configuration allows for efficient, parallel data fetching and state management as above.

#### `createBrowserRouter`

`createBrowserRouter` creates a basic router component class that uses the HTML5 History API for navigation. This factory uses reasonable defaults that should fit a variety use cases.

```js
import { createBrowserRouter } from "found";

const BrowserRouter = createBrowserRouter({
  routeConfig,

  renderError: ({ error }) => (
    <div>{error.status === 404 ? "Not found" : "Error"}</div>
  ),
});

ReactDOM.render(<BrowserRouter />, document.getElementById("root"));
```

`createBrowserRouter` takes an options object. The only mandatory property on this object is `routeConfig`, which should be a route configuration as above.

The options object also accepts a number of optional properties:

- `historyMiddlewares: Middleware[]` - an array of [Farce history middlewares](https://github.com/4Catalyzer/farce#middlewares); by default, an array containing only `queryMiddleware`
- `historyOptions: Omit<HistoryEnhancerOptions, 'protocol' | 'middlewares'>;` - additional configuration options for the Farce history store enhancer
- `renderPending: (args: RenderPendingArgs) => React.ReactElement;`: a custom render function called when some routes are not yet ready to render, due to those routes have unresolved asynchronous dependencies and no route-level `render` method for handling the loading state
- `renderReady: (args: RenderPendingArgs) => React.ReactElement;`: a custom render function called when all routes are ready to render
- `renderError: (args: RenderPendingArgs) => React.ReactElement;`: a custom render function called if an `HttpError` is thrown while resolving route elements

```ts title="/types/index.d.ts"
type RenderPendingArgs = Match;
interface Match<TContext = any> {
  location: LocationDescriptor; // The current [location object](https://github.com/4Catalyzer/farce#locations-and-location-descriptors)
  params: Params; // The union of path parameters for all matched routes
  routes: RouteObject[]; // An array of all matched route objects
  route: RouteObject; // The route object corresponding to this component
  routeParams: Params[]; // The path parameters for `route`
  routeIndices: RouteIndices;
  context: TContext;
}
```

- `render: (args: RenderArgs) => React.ReactElement;`: a custom render function called in all cases, superseding `renderPending`, `renderReady`, and `renderError`; by default, this is `createRender({ renderPending, renderReady, renderError }: CreateRenderOptions)`

The `renderPending`, `renderReady`, `renderError`, and `render` functions receive the routing state object as an argument, with the following additional properties:

- `elements: RenderArgsElements;`: if present, an array the resolved elements for the matched routes; the array item will be `null` for routes without elements
- `error: HttpError`: if present, the `HttpError` object thrown during element resolution with properties describing the error
  - `status: number`: the status code; this is the first argument to the `HttpError` constructor
  - `data: any`: additional error data; this is the second argument to the `HttpError` constructor

You should specify a `renderError` function or otherwise handle error states. You can specify `renderPending` and `renderReady` functions to indicate loading state globally; the [global pending state example](https://github.com/4Catalyzer/found/tree/master/examples/global-pending) demonstrates doing this using a static container.

The created `<BrowserRouter>` accepts an optional `matchContext: any` prop as described above that injects additional context into the route resolution methods.

#### `createFarceRouter`

`createFarceRouter` exposes additional configuration for customizing navigation management and route element resolution. To enable minimizing bundle size, it omits some defaults from `createBrowserRouter`.

```js
import { BrowserProtocol, queryMiddleware } from "farce";
import { createFarceRouter, resolver } from "found";

const FarceRouter = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig,

  renderError: ({ error }) => (
    <div>{error.status === 404 ? "Not found" : "Error"}</div>
  ),
});

ReactDOM.render(
  <FarceRouter resolver={resolver} />,
  document.getElementById("root"),
);
```

The options object for `createFarceRouter` should have a `historyProtocol` property that has a history protocol object. For example, to use the HTML History API as with `createBrowserRouter`, you would provide `new BrowserProtocol()`.

The created `<FarceRouter>` manages setting up and providing a Redux store with the appropriate configuration internally. It also requires a `resolver` prop with the route element resolver object. For routes configured as above, this should be the `resolver` object in this library.
