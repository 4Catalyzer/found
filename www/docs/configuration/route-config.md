---
sidebar_position: 1
---

# Route configuration

A route object under the default matching algorithm and route element resolver consists of the following properties, all of which are optional:

- `path: string`: a string defining the pattern for the route

- `Component` or `getComponent` - the component for the route, or a method that returns the component for the route

```ts
Component: React.ComponentType<any>;
getComponent: (match: RouteMatch) =>
  React.ComponentType<any> | Promise<React.ComponentType<any>>;
```

- `data` or `getData`: additional data for the route, or a method that returns additional data for the route

```ts
data: any;
getData: (match: RouteMatch) => any;
```

- `allowAsIndex: boolean`: Indicates a Route with children also functions as it's own index route.
- `defer: boolean`: whether to wait for all parent `data` or `getData` promises to resolve before getting data for this route and its descendants
- `render: (args: RouteRenderArgs): ResolvedElement | undefined`: a method that returns the element for the route
- `children`: an array of child route objects, or an object of those arrays; if using JSX configuration components, this comes from the JSX children

A route configuration consists of an array of route objects.

:::tip
You can generate such an array of route objects from JSX with `<Route>` elements using `makeRouteConfig`, as shown previously in [quick start](/getting-started/quick-start.mdx).
:::

By default, `<Route />` components receive the following additional props describing the current routing state:

- `match: Match`: an object with router state properties, conforming to the `matchShape` prop type validator

```ts title="/types/index.d.ts"
interface Match<TContext = any> {
  location: LocationDescriptor; // The current [`location object`](https://github.com/4Catalyzer/farce#locations-and-location-descriptors)
  params: Params; // The union of path parameters for all matched routes
  routes: RouteObject[]; // An array of all matched route objects
  route: RouteObject; // The route object corresponding to this component
  routeParams: Params[]; // The path parameters for `route`
  routeIndices: RouteIndices;
  context: TContext;
}
```

- `router: Router`: an object with static router properties, conforming to the `routerShape` prop type validator

```ts title="/types/index.d.ts"
interface Router {
  push: (location: LocationDescriptor) => void; // Navigates to a new location
  replace: (location: LocationDescriptor) => void; // Replaces the existing history entry
  go: (delta: number) => void; // Moves `delta` steps in the history stack
  isActive: (
    match: Match,
    location: LocationDescriptor,
    { exact: boolean },
  ) => boolean; // For `match` as above, returns whether `match` corresponds to `location` or a subpath of `location`; if `exact` is set, returns whether `match` corresponds exactly to `location`
  format: (pattern: string, params: ParamsDescriptor) => string;
  addNavigationListener(
    listener: (location: LocationDescriptor) => any,
    { beforeUnload: boolean },
  ); // Adds a [navigation listener](https://github.com/4Catalyzer/farce#navigation-listeners) that can [block navigation](#blocking-navigation)
}
```

:::tip
The `getComponent` method receives an object containing the same properties as the `match` object above, with an additional `router` property as above.
:::

#### `path`

Specify a `path` pattern to control the paths for which a route is active. These patterns are handled using [Path-to-RegExp](https://github.com/pillarjs/path-to-regexp) and follow the rules there. Both named and unnamed parameters will be captured in `params` and `routeParams` as below. The following are common patterns:

- `/path/subpath`
  - Matches `/path/subpath`
- `/path/:param`
  - Matches `/path/foo` with `params` of `{ param: 'foo' }`
- `/path/:regexParam(\\d+)`
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

#### `data` or `getData`

Specify the `data` property or `getData` method to inject data into a route component as the `data` prop. `data` can be any value. `getData` can be any value, or a promise that resolves to any value. `getData` receives an object containing the routing state, as described above for `getComponent`.

The `getData` method is intended for loading additional data from your back end for a given route. By design, all requests for asynchronous component and data dependencies will be issued in parallel. Found uses static route configurations specifically to enable issuing these requests in parallel.

If you need additional context such as a store instance to fetch data, specify this as the `matchContext` prop to your router. This context value will then be available as the `context` property on the argument to `getData`.

```js
const route = {
  path: "widgets/:widgetId",
  Component: WidgetPage,
  getData: ({ params, context }) =>
    context.store.dispatch(Actions.getWidget(params.widgetId)),
};

// ...
<Router matchContext={{ store }} />;
```

:::caution
It does not make sense to specify `data` or `getData` if the route does not have a component as above or a `render` method.
:::

#### `allowAsIndex`

Convenience prop for indicating a Route with children also functions
as it's own index route.

```tsx
const routeConfig = [
  {
    path: "customers",
    Component: Page,
    allowAsIndex: true,
    children: [
      {
        path: ":customerId",
        Component: ChildPage,
      },
    ],
  },
];
```

This is equivalent to when matching `'/customers'`:

```tsx
const routeConfig = [
  {
    path: "customers",
    Component: Page,
    children: [
      {
        Component: () => null,
      },
      {
        path: ":customerId",
        Component: ChildPage,
      },
    ],
  },
];
```

#### `defer`

By default, Found will issue all data fetching operations in parallel. However, if you wish to defer data fetching for a given route until its parent data promises has been resolved, you may do so by setting `defer` on the route.

```tsx
const routeConfig = [
  {
    Component: Parent,
    getData: getParentData,
    children: [
      {
        Component: Child,
        getData: getChildData,
        defer: true,
      },
    ],
  },
];
```

Setting `defer` on a route will make the resolver defer calling its `getData` method and the `getData` methods on all of its descendants until all of its parent data promises have resolved.

:::caution
This should be a relatively rare scenario, as generally user experience is better if all data are fetched in parallel, but in some cases it can be desirable to avoid making data fetching operations that are guaranteed to fail, such as when the user is not authenticated, when optimizing for client bandwidth usage or API utilization.
:::

#### `render`

Specify the `render` method to further customize how the route renders. It receives an object with the following properties:

It should return:

- another function that receives its children as an argument and returns a React element; this function receives
  - a React element when not using named child routes
  - an object when using named child routes
  - `null` when it has no children
- a React element to render that element
- `undefined` if it has a pending asynchronous component or data dependency and is not ready to render
- `null` to render its children (or nothing if there are no children)

Note that, when specifying this `render` method, `Component` or `getComponent` will have no effect other than controlling the value of the `Component` property on the argument to `render`. Additionally, the behavior is different between returning a function that returns `null` and returning `null` directly; in the former case, nothing will be rendered, while in the latter case, the route's children will be rendered.

```ts title="/types/index.d.ts"
interface RenderProps {
  match: Match; // The routing state object, as above
  Component: React.ComponentType<any>; // The component for the route, if any; `null` if the component has not yet been loaded
  props: Match & {data: any | null}; // `The default props for the route component, specifically `match` with `data` as an additional property; `null` if `data` have not yet been loaded
  data: any; // The data for the route, as above; `null` if the data have not yet been loaded
}

render: (e: RenderProps) => React.ComponentType<any> | (children) => React.ComponentType<any> | null | undefined;
```

:::tip
You can use this method to render per-route loading state.

```js
function loadingRender({ Component, props }) {
  if (!Component || !props) {
    return <LoadingIndicator />;
  }

  return <Component {...props} />;
}

const routeConfig = [
  {
    path: "/",
    render: loadingRender,
    // ... other route properties
  },
];
```

:::

If any matched routes have unresolved asynchronous component or data dependencies, the router will initially attempt to render all such routes in their loading state. If those routes all implement `render` methods and return non-`undefined` values from their `render` methods, the router will render the matched routes in their loading states. Otherwise, the router will continue to render the previous set of routes until all asynchronous dependencies resolve.
