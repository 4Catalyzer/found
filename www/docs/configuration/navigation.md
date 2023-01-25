---
sidebar_postion: 3
---

# Navigation

Found provides a high-level abstractions such as a link component for controlling browser navigation. Under the hood, it delegates to [Farce](https://github.com/4Catalyzer/farce) for implementation, and as such can also be controlled directly via the Redux store.

#### Links

The `<Link>` component renders a link with optional active state indication.

```js
const link1 = (
  <Link to="/widgets/foo" activeClassName="active">
    Foo widget
  </Link>
);

const link2 = (
  <Link
    as={CustomAnchor}
    to={{
      pathname: "/widgets/bar",
      query: { the: query },
    }}
    activePropName="active"
  >
    Bar widget with query
  </Link>
);

const link3 = (
  <Link
    to={{
      pathname: "/widgets/bar",
      query: { the: query },
    }}
  >
    {({ href, active, onClick }) => (
      <CustomButton href={href} active={active} onClick={onClick} />
    )}
  </Link>
);
```

`<Link>` accepts the following props:

- `to`: a [location descriptor](https://github.com/4Catalyzer/farce#locations-and-location-descriptors) for the link's destination
- `exact`: if specified, the link will only render as active if the current location exactly matches the `to` location descriptor; by default, the link also will render as active on subpaths of the `to` location descriptor
- `activeClassName`: if specified, a CSS class to append to the component's CSS classes when the link is active
- `activeStyle`: if specified, a style object to append merge with the component's style object when the link is active
- `activePropName`: if specified, a prop to inject with a boolean value with the link's active state
- `as`: if specified, the custom element type to use for the link; by default, the link will render an `<a>` element

A link will navigate per its `to` location descriptor when clicked. You can prevent this navigation by providing an `onClick` handler that calls `event.preventDefault()`.

`<Link>` accepts a function for `children`. If `children` is a function, then `<Link>` will render the return value of that function, and will ignore `activeClassName`, `activeStyle`, `activePropName`, and `as` above. The function will be called with an object with the following properties:

- `href`: the URL for the link
- `active`: whether the link is active
- `onClick`: the click event handler for the link element

Otherwise, `<Link>` forwards additional props to the child element.

#### Programmatic navigation

The `withRouter` HOC wraps an existing component class or function and injects `match` and `router` props, as on route components above. You can use this HOC to create components that navigate programmatically in event handlers.

```js
class MyButton extends React.Component {
  onClick = () => {
    this.props.router.replace("/widgets");
  };

  render() {
    return (
      <button onClick={this.onClick}>
        Current widget: {this.props.match.params.widgetId}
      </button>
    );
  }
}

export default withRouter(MyButton);
```

The `useRouter` Hook provides the same capabilities.

```js
function MyButton() {
  const { match, router } = useRouter();

  const onClick = useCallback(() => {
    router.replace("/widgets");
  }, [router]);

  return (
    <button onClick={onClick}>
      Current widget: {match.params.widgetId}
    </button>
  );
}
```

#### Blocking navigation

The `router.addNavigationListener` method adds a [navigation listener](https://github.com/4Catalyzer/farce#navigation-listeners) that can block navigation. This method accepts a navigation listener function and an optional options object. It returns a function that removes the navigation listener.

```js
function MyForm(props) {
  const [dirty, setDirty] = useState(false);
  const { router } = useRouter();

  useEffect(
    () =>
      dirty
        ? router.addNavigationListener(
            () =>
              "You have unsaved input. Are you sure you want to leave this page?"
          )
        : undefined,
    [dirty]
  );

  /* ... */
}
```

The navigation listener function receives the location to which the user is attempting to navigate as its argument. Return `true` or `false` from this function to allow or block navigation respectively. Return a string to display a default confirmation dialog to the user. Return a nully value to use the next navigation listener if present, or else allow navigation. Return a promise to defer allowing or blocking navigation until the promise resolves; you can use this to display a custom confirmation dialog.

If you want to run your navigation listeners when the user attempts to leave the page, set `beforeUnload` in the options object. If this option is enabled, your navigation listeners will be called with a `null` location when the user attempts to leave the page. In this scenario, the navigation listener must return a non-promise value.

```js
router.addNavigationListener(
  (location) => {
    if (!location) {
      return false;
    }

    return asyncConfirm(location);
  },
  { beforeUnload: true }
);
```

The [navigation listener usage example](https://github.com/4Catalyzer/found/tree/master/examples/navigation-listener) demonstrates the use of navigation listeners in more detail, including the use of the `beforeUnload` option.
