import { shallowEqual, useSelector, useStore } from 'react-redux';
import { Store } from 'redux';

import createBaseRouter from './createBaseRouter';
import {
  type ConnectedRouterOptions,
  type ConnectedRouterProps,
  type ConnectedRouter as ConnectedRouterType,
  type FoundState,
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
