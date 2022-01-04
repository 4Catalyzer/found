---
sidebar_position: 6
---

# Redux integration

Found uses Redux to manage all serializable state. Farce uses Redux actions for navigation. As such, you can also access those serializable parts of the routing state from the store state, and you can navigate by dispatching actions.

If you are using your own Redux store, use `createConnectedRouter` as described above to have a single store that contains both routing state and other application state. Additionally, if you need to make this store available in `getData` methods on routes, pass it to `matchContext` on the router component as described above.

To access the current routing state, connect to the `resolvedMatch` property of the `foundReducer` state. To navigate, dispatch the appropriate actions from Farce.

```js
import { Actions as FarceActions } from 'farce';
import { connect } from 'react-redux';

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
