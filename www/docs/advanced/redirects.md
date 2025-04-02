---
sidebar_position: 3
---

# Redirects

The `createRedirect` helpers sets up static redirect routes. You can also use it to create JSX `<Redirect>` elements for use with `makeRouteConfig`. This class takes `from` and `to` properties and an optional `status` property. `from` should be a path pattern as for normal routes above. `to` can be either a path pattern or a function. If it is a path pattern, the router will populate path parameters appropriately. If it is a function, it will receive the same routing state object as `getComponent` and `getData`, as described above. `status` is used to set the HTTP status code when redirecting from the server, and defaults to `302` if it is not specified.

```js
import { createRedirect } from "found";
import { Route, Redirect } from "found/jsx";

const redirect1 = createRedirect({
  from: "widget/:widgetId",
  to: "/widgets/:widgetId",
});

const redirect2 = createRedirect({
  from: "widget/:widgetId",
  to: ({ params }) => `/widgets/${params.widgetId}`,
  status: 301,
});

const jsxRedirect1 = (
  <Redirect from="widget/:widgetId" to="/widgets/:widgetId" />
);

const jsxRedirect2 = (
  <Redirect
    from="widget/:widgetId"
    to={({ params }) => `/widgets/${params.widgetId}`}
    status={301}
  />
);
```

If you need more custom control over redirection, throw a `RedirectException` in your route's `render` method with a [location descriptor](https://github.com/4Catalyzer/farce#locations-and-location-descriptors) and optional status code as above for the redirect destination.

```js
const customRedirect = {
  getData: fetchRedirectInfo,
  render: ({ data }) => {
    if (data) {
      throw new RedirectException(data.redirectLocation);
    }
  },
};

const permanentRedirect = {
  render: () => {
    throw new RedirectException("/widgets", 301);
  },
};
```
