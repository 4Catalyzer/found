import FarceActionTypes from 'farce/lib/ActionTypes';
import { applyMiddleware } from 'redux';

import ActionTypes from './ActionTypes';

function createMatchMiddleware(matcher) {
  return function matchMiddleware() {
    return next => (action) => {
      const { type, payload } = action;
      if (type !== FarceActionTypes.UPDATE_LOCATION) {
        return next(action);
      }

      return next({
        type: ActionTypes.UPDATE_MATCH,
        payload: {
          location: payload,
          ...matcher.match(payload),
        },
      });
    };
  };
}

export default function createMatchEnhancer(matcher) {
  return function matchEnhancer(createStore) {
    return (...args) => {
      const middlewareEnhancer = applyMiddleware(
        createMatchMiddleware(matcher),
      );

      const store = middlewareEnhancer(createStore)(...args);

      return {
        ...store,
        found: {
          isActive: (match, location, options) => (
            matcher.isActive(match, location, options)
          ),
        },
      };
    };
  };
}
