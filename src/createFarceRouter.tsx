import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect';
import { HistoryEnhancerOptions, Protocol } from 'farce';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Middleware, Store } from 'redux';

import createBaseRouter, { ConnectedRouterProps } from './createBaseRouter';
import { ConnectedRouterOptions } from './createConnectedRouter';
import createFarceStore from './createFarceStore';
import { FoundState, RouteConfig } from './utilityTypes';

export interface FarceRouterOptions extends ConnectedRouterOptions {
  store?: Store;
  historyProtocol: Protocol;
  historyMiddlewares?: Middleware[];
  historyOptions?: Omit<HistoryEnhancerOptions, 'protocol' | 'middlewares'>;
  routeConfig: RouteConfig;
}

export type FarceRouter = React.ComponentType<FarceRouterProps>;
export type FarceRouterProps = ConnectedRouterProps;
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
