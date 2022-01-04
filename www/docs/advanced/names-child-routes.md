---
sidebar_position: 4
---

# Named child routes

Specify an object for the `children` property on a route to set up named child routes. A route with named child routes will match only if every route group matches. The elements corresponding to the child routes will be available on their parent as props with the same name as the route groups.

```js
function AppPage({ nav, main }) {
  return (
    <div className="app">
      <div className="nav">{nav}</div>
      <div className="main">{main}</div>
    </div>
  );
}

const route = {
  path: '/',
  Component: AppPage,
  children: [
    {
      path: 'foo',
      children: {
        nav: [
          {
            path: '(.*)?',
            Component: FooNav,
          },
        ],
        main: [
          {
            path: 'a',
            Component: FooA,
          },
          {
            path: 'b',
            Component: FooB,
          },
        ],
      },
    },
    {
      path: 'bar',
      children: {
        nav: [
          {
            path: '(.*)?',
            Component: BarNav,
          },
        ],
        main: [
          {
            Component: BarMain,
          },
        ],
      },
    },
  ],
};

// or equivalent JSX syntax

const jsxRoute = (
  <Route path="/" Component={AppPage}>
    <Route path="foo">
      {{
        nav: <Route path="(.*)?" Component={FooNav} />,
        main: [
          <Route path="a" Component={FooA} />,
          <Route path="b" Component={FooB} />,
        ],
      }}
    </Route>
    <Route path="bar">
      {{
        nav: <Route path="(.*)?" Component={BarNav} />,
        main: <Route Component={BarMain} />,
      }}
    </Route>
  </Route>
);
```
