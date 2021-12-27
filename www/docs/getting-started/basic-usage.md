---
sidebar_position: 2
---

# Basic usage

Define a route configuration as an array of objects, or as JSX with `<Route>` elements using `makeRouteConfig`.

```tsx
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
  </Route>,
);
```

Create a router using your route configuration. For a basic router that uses the HTML5 History API, use `createBrowserRouter`.

```ts
const BrowserRouter = createBrowserRouter({ routeConfig });
```

Render this router component into the page.

```ts
ReactDOM.render(<BrowserRouter />, document.getElementById('root'));
```

In components rendered by the router, use `<Link>` to render links that navigate when clicked and display active state.

```tsx
<Link to="/foo" activeClassName="active">
  Foo
</Link>
```
:::tip 

You can use [spa-routing](https://github.com/4Catalyzer/spa-routing) to manage your links in an organized and well-typed way

:::


That's basically it! Right now you should have a fully functional routing setup.