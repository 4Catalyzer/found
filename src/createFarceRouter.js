import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import createBaseRouter from './createBaseRouter';
import createFarceStore from './createFarceStore';

export default function createFarceRouter({
  store: userStore,
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  matcherOptions,
  getFound = ({ found }) => found,
  ...options
}) {
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

  const FarceRouter = forwardRef((props, ref) => {
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

  FarceRouter.displayName = 'FarceRouter';

  return FarceRouter;
}
