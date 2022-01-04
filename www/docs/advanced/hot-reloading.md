---
sidebar_position: 9
---

# Hot reloading

When using hot reloading via [React Hot Loader](https://gaearon.github.io/react-hot-loader/), mark your route configuration with `hotRouteConfig` to enable hot reloading for your route configuration as well.

```js
export default hotRouteConfig(routeConfig);
```

This will replace the route configuration and rerun the match with the current location whenever the route configuration changes. As with React Hot Loader, this is safe to do unconditionally, as it will have no effect in production.

:::note
Changes to route components also count as route configuration changes. If your routes have asynchronous data dependencies, ensure that the data are cached. Otherwise, the router will refetch data every time a route component changes.
:::

`createMatchEnhancer` takes an optional `getFound` function as its second argument. If you installed `foundReducer` on a key other than `found`, specify the `getFound` function to retrieve the reducer state to enable this hot reloading support.

You can also manually replace the route configuration and rerun the match by calling `found.replaceRouteConfig` on a Found-enhanced store object.
