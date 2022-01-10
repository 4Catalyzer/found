import FarceActionTypes from 'farce/ActionTypes';
import { applyMiddleware } from 'redux';

import ActionTypes from './ActionTypes';

function createMatchMiddleware(matcher, getFound) {
  return function matchMiddleware(store) {
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
  matcher,
  getFound = ({ found }) => found,
) {
  return function matchEnhancer(createStore) {
    return (...args) => {
      const middlewareEnhancer = applyMiddleware(
        createMatchMiddleware(matcher, getFound),
      );

      const store = middlewareEnhancer(createStore)(...args);

      function replaceRouteConfig(routeConfig) {
        matcher.replaceRouteConfig(routeConfig);

        store.dispatch({
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
