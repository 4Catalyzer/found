import React from 'react';
import { shallowEqual, useSelector, useStore } from 'react-redux';
import { Store } from 'redux';

import createBaseRouter from './createBaseRouter';
import {
  ConnectedRouterOptions,
  ConnectedRouterProps,
  ConnectedRouter as ConnectedRouterType,
  FoundState,
} from './typeUtils';

export default function createConnectedRouter({
  getFound = ({ found }: any) => found as FoundState,
  ...options
}: ConnectedRouterOptions): ConnectedRouterType {
  const Router = createBaseRouter(options);

  const getFoundState = (state: Store) => {
    const { match, resolvedMatch } = getFound(state);
    return { match, resolvedMatch };
  };

  function ConnectedRouter(props: ConnectedRouterProps) {
    const store = useStore();
    const foundState = useSelector(getFoundState, shallowEqual);

    return <Router {...props} {...foundState} store={store} />;
  }

  return ConnectedRouter;
}
