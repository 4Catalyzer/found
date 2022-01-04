---
sidebar_position: 1
---

# Accessing route matches in components

To access details of the current route match, Found injects `{ router, match }` props
into every route `Component` that matches for a URL. Sometimes it's not convenient to pass these
down deeper into your component tree. To avoid this, Found provides a set of hooks for accessing
the route match state.

`useRouter` can be used to access both the current match and Router instance:

```js
function MyButton() {
  const { match, router } = useRouter();

  const onClick = useCallback(() => {
    router.replace('/widgets');
  }, [router]);

  return (
    <button onClick={onClick}>Current widget: {match.params.widgetId}</button>
  );
}
```

Route `match` contains the current route params, location, as well as matched route configs.
There are also `useMatch`, `useParams` and `useLocation` for retrieving only what you specifically
need.
