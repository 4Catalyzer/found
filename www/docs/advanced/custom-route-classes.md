---
sidebar_position: 5
---

# Custom route classes

You can implement reusable logic in routes with a custom route class. When extending `Route`, methods defined on the class will be overridden by explicitly specified route properties. You can use custom route classes for either object route configurations or JSX route configurations.

:::note
To avoid issues with [React Hot Loader](https://gaearon.github.io/react-hot-loader/), custom route classes should usually extend `Route`.
:::

```js
class AsyncRoute extends Route {
  // An explicit render property on the route will override this.
  render({ Component, props }) {
    return Component && props ? (
      <Component {...props} />
    ) : (
      <LoadingIndicator />
    );
}

const myRoute = new AsyncRoute(properties);
const myJsxRoute = <AsyncRoute {...properties} />;
```
