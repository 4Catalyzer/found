---
sidebar_position: 8
---

# Server-side rendering

Found supports server-side rendering for universal applications. Functionality specific to server-side rendering is available in `found/server`.

To render your application on the server, use `getFarceResult`.

```js
import { getFarceResult } from 'found/server';

/* ... */

app.use(async (req, res) => {
  const { redirect, status, element } = await getFarceResult({
    url: req.url,
    routeConfig,
    render,
  });

  if (redirect) {
    res.redirect(redirect.status, redirect.url);
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

The options object for `getFarceResult` also takes the `historyMiddlewares` and `historyOptions` properties, as above for creating Farce router component classes. This options object also takes optional `matchContext` and `resolver` properties, as described above as props for router components. `resolver` defaults to the standard `resolver` object in this library.

`getFarceResult` returns a promise for an object with the following properties:

- `redirect`: if present, indicates that element resolution triggered a redirect; `redirect.url` contains the full path for the redirect location
- `status`: if there was no redirect, the HTTP status code for the response; this will be `error.status` from any encountered `HttpError`, or 200 otherwise
- `element`: if there was no redirect, the React element corresponding to the router component on the client

This promise resolves when all asynchronous dependencies are available. If your routes require asynchronous data, e.g. from `getData` methods, you may want to dehydrate those data on the server, then rehydrate them on the client, to avoid the client having to request those data again.

When using server-side rendering, you need to delay the initial render on the client, such that the initial client-rendered markup matches the server-rendered markup. To do so, use `createInitialBrowserRouter` or `createInitialFarceRouter` instead of `createBrowserRouter` or `createFarceRouter` respectively.

```js
import { createInitialBrowserRouter } from 'found';

/* ... */

(async () => {
  const BrowserRouter = await createInitialBrowserRouter({
    routeConfig,
    render,
  });

  ReactDOM.render(<BrowserRouter />, document.getElementById('root'));
})();
```

These behave similarly to their counterparts above, except that the options object for `createInitialBrowserRouter` requires a `render` method, and ignores the `renderPending`, `renderReady`, and `renderError` properties. Additionally, these functions take the initial `matchContext` and `resolver` if relevant as properties on the options object, rather than as props.

#### Server-side rendering with custom Redux store

Found exposes lower-level functionality for doing server-side rendering for use with your own Redux store, as with `createConnectedRouter` above. On the server, use `getStoreRenderArgs` to get a promise for the arguments to your `render` function, then wrap the rendered elements with a `<RouterProvider>`.

```js
import { getStoreRenderArgs } from 'found';
import { RouterProvider } from 'found/server';

/* ... */

app.use(async (req, res) => {
  /* ... */

  let renderArgs;

  try {
    renderArgs = await getStoreRenderArgs({
      store,
      matchContext,
      resolver,
    });
  } catch (e) {
    if (e.isFoundRedirectException) {
      res.redirect(e.status, store.farce.createHref(e.location));
      return;
    }

    throw e;
  }

  res.status(renderArgs.error ? renderArgs.error.status : 200).send(
    renderPageToString(
      <Provider store={store}>
        <RouterProvider renderArgs={renderArgs}>
          {render(renderArgs)}
        </RouterProvider>
      </Provider>,
      store.getState(),
    ),
  );
});
```

You must dispatch `FarceActions.init()` before calling `getStoreRenderArgs`. `getStoreRenderArgs` takes an options object. This object must have the `store` property for your store and the `resolver` property as described above. It supports an optional `matchContext` property as described above as well. `getStoreRenderArgs` returns a promise that resolves to a `renderArgs` object that can be passed into a `render` function as above.

On the client, pass the value resolved by by `getStoreRenderArgs` to your `<ConnectedRouter>` as the `initialRenderArgs` prop.

```js
import { getStoreRenderArgs } from 'found';

/* ... */

(async () => {
  const initialRenderArgs = await getStoreRenderArgs({
    store,
    matchContext,
    resolver,
  });

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter
        matchContext={matchContext}
        resolver={resolver}
        initialRenderArgs={initialRenderArgs}
      />
    </Provider>,
    document.getElementById('root'),
  );
})();
```
