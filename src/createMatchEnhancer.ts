import FarceActionTypes from 'farce/ActionTypes';
import { Middleware, Store, StoreEnhancer, applyMiddleware } from 'redux';

import ActionTypes from './ActionTypes';
import Matcher from './Matcher';
import { FoundState, FoundStoreExtension, RouteConfig } from './typeUtils';

function createMatchMiddleware(
  matcher: Matcher,
  getFound: ({ found }: any) => FoundState,
): Middleware {
  return function matchMiddleware(store: Store) {
    return (next) => (action) => {
      const { type, payload } = action;
      if (type !== FarceActionTypes.UPDATE_LOCATION) {
        return next(action);
      }

      let matchPayload;
      if (!payload.doNotRerunMatch) {
        matchPayload = {
          location: payload,
          ...matcher.match(payload),
        };
      } else {
        // HAX: this is terrible, but sometimes you need to update the location without updating the routing world
        // so we mutate the current match which will keep it referencially the same and pass checks but update the location
        // on it
        const { match } = getFound(store.getState());
        match.location = payload;
        matchPayload = match;
      }

      return next({
        type: ActionTypes.UPDATE_MATCH,
        payload: matchPayload,
      });
    };
  };
}

export default function createMatchEnhancer(
  matcher: Matcher,
  getFound = ({ found }: any) => found,
): StoreEnhancer<{ found: FoundStoreExtension }> {
  return function matchEnhancer(createStore) {
    return (...args) => {
      const middlewareEnhancer = applyMiddleware(
        createMatchMiddleware(matcher, getFound),
      );

      const store = middlewareEnhancer(createStore)(...args);

      function replaceRouteConfig(routeConfig: RouteConfig) {
        matcher.replaceRouteConfig(routeConfig);

        store.dispatch<any>({
          type: FarceActionTypes.UPDATE_LOCATION,
          payload: getFound(store.getState()).match.location,
        });
      }

      return {
        ...store,
        found: { matcher, replaceRouteConfig },
      };
    };
  };
}
