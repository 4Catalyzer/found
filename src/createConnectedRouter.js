import React from 'react';
import { shallowEqual, useSelector, useStore } from 'react-redux';

import createBaseRouter from './createBaseRouter';

export default function createConnectedRouter({
  getFound = ({ found }) => found,
  ...options
}) {
  const Router = createBaseRouter(options);

  const getFoundState = (state) => {
    const { match, resolvedMatch } = getFound(state);
    return { match, resolvedMatch };
  };

  function ConnectedRouter(props) {
    const store = useStore();
    const foundState = useSelector(getFoundState, shallowEqual);

    return <Router {...props} {...foundState} store={store} />;
  }

  return ConnectedRouter;
}
