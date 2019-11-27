import FarceActionTypes from 'farce/lib/ActionTypes';
import { applyMiddleware } from 'redux';

import ActionTypes from './ActionTypes';

function createMatchMiddleware(matcher) {
  return function matchMiddleware() {
    return next => action => {
      const { type, payload } = action;
      if (type !== FarceActionTypes.UPDATE_LOCATION) {
        return next(action);
      }
      const match = matcher.match(payload);
      if (!match) {
        throw new Error('Route not found: ' + payload.pathname);
      }
      return next({
        type: ActionTypes.UPDATE_MATCH,
        payload: {
          location: payload,
          ...match,
        },
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
        createMatchMiddleware(matcher),
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
