---
sidebar_position: 6
---

# Redux integration

Found uses Redux to manage all serializable state. Farce uses Redux actions for navigation. As such, you can also access those serializable parts of the routing state from the store state, and you can navigate by dispatching actions.

If you are using your own Redux store, you can create your own router via `createBaseRouter` to have a single store that contains both routing state and other application state. Additionally, if you need to make this store available in `getData` methods on routes, pass it to `matchContext` on the router component.

```js
import {
  Actions as FarceActions,
  BrowserProtocol,
  createHistoryEnhancer,
  queryMiddleware,
} from "farce";
import {
  createConnectedRouter,
  createMatchEnhancer,
  createRender,
  foundReducer,
  Matcher,
  resolver,
} from "found";
import { Provider } from "react-redux";
import { combineReducers, compose, createStore } from "redux";

/* ... */

const store = createStore(
  combineReducers({
    found: foundReducer,
  }),
  compose(
    createHistoryEnhancer({
      protocol: new BrowserProtocol(),
      middlewares: [queryMiddleware],
    }),
    createMatchEnhancer(new Matcher(routeConfig)),
  ),
);

store.dispatch(FarceActions.init());

const Router = createBaseRouter({
  render: createRender({
    renderError: ({ error }) => (
      <div>{error.status === 404 ? "Not found" : "Error"}</div>
    ),
  }),
});

const getFoundState = (state) => {
  return state.found;
};

function ConnectedRouter(props) {
  const store = useStore();
  const foundState = useSelector(getFoundState, shallowEqual);

  return <Router {...props} {...foundState} store={store} />;
}

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ConnectedRouter resolver={resolver} />
  </Provider>,
);
```

To access the current routing state, connect to the `resolvedMatch` property of the `foundReducer` state. To navigate, dispatch the appropriate actions from Farce.

```js
import { Actions as FarceActions } from "farce";
import { connect } from "react-redux";

const MyConnectedComponent = connect(
  ({ found: { resolvedMatch } }) => ({
    location: resolvedMatch.location,
    params: resolvedMatch.params,
  }),
  {
    push: FarceActions.push,
  },
)(MyComponent);
```
