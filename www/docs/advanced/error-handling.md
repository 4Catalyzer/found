---
sidebar_position: 2
---

# Error handling

The `HttpError` class signals handled router-level error states. This error class takes a status value that should be an integer corresponding to an HTTP error code and an optional data value of any type. You can handle these errors and render appropriate error feedback in the router-level render method described below.

```js
throw new HttpError(status, data);
```

The router will throw a `new HttpError(404)` in the case when no routes match the current location. Otherwise, you can throw `HttpError` instances in the `getComponent`, `getData`, and `render` methods to signal error states.

```js
const route = {
  path: 'widgets/:widgetId',
  Component: WidgetPage,
  getData: ({ params: { widgetId } }) =>
    fetchWidget(widgetId).catch(() => {
      throw new HttpError(404);
    }),
};
```
