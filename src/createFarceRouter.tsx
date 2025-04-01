import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect';
import { forwardRef, useImperativeHandle, useState } from 'react';

import createBaseRouter from './createBaseRouter';
import createFarceStore from './createFarceStore';
import {
  type FarceRouter,
  type FarceRouterOptions,
  type FoundState,
} from './typeUtils';

export default function createFarceRouter({
  store: userStore,
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  // @ts-ignore TODO: matcher options should not accessible to end user
  matcherOptions,
  getFound = ({ found }: any) => found as FoundState,
  ...options
}: FarceRouterOptions): FarceRouter {
  const Router = createBaseRouter(options);

  const store =
    userStore ||
    createFarceStore({
      historyProtocol,
      historyMiddlewares,
      historyOptions,
      routeConfig,
      matcherOptions,
    });

  const FarceRouterInstance: FarceRouter = forwardRef((props, ref) => {
    const [state, setState] = useState(() => {
      const { match, resolvedMatch } = getFound(store.getState());
      return { match, resolvedMatch };
    });

    useIsomorphicEffect(() => {
      return store.subscribe(() => {
        setState((prev) => {
          const { match, resolvedMatch } = getFound(store.getState());
          if (prev?.match === match && prev.resolvedMatch === resolvedMatch) {
            return prev;
          }
          return { match, resolvedMatch };
        });
      });
    }, []);

    useImperativeHandle(ref, () => store, []);

    return <Router {...props} {...state} store={store} />;
  });

  FarceRouterInstance.displayName = 'FarceRouter';

  return FarceRouterInstance;
}
