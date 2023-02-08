import React from 'react';
import { shallowEqual, useSelector, useStore } from 'react-redux';
import { Store } from 'redux';

import { RenderArgs } from './ElementsRenderer';
import createBaseRouter, { ConnectedRouterProps } from './createBaseRouter';
import { CreateRenderOptions } from './createRender';
import { FoundState } from './typeUtils';

export type ConnectedRouter = React.ComponentType<ConnectedRouterProps>;
export interface ConnectedRouterOptions extends CreateRenderOptions {
  render?: (args: RenderArgs) => React.ReactElement;
  getFound?: (store: Store) => FoundState;
}

export default function createConnectedRouter({
  getFound = ({ found }: any) => found as FoundState,
  ...options
}: ConnectedRouterOptions): ConnectedRouter {
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
