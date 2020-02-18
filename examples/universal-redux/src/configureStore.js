import { createHistoryEnhancer, queryMiddleware } from 'farce';
import Matcher from 'found/lib/Matcher';
import createMatchEnhancer from 'found/lib/createMatchEnhancer';
import foundReducer from 'found/lib/foundReducer';
import { combineReducers, compose, createStore } from 'redux';

import routeConfig from './routeConfig';

export default function configureStore(historyProtocol, preloadedState) {
  return createStore(
    combineReducers({
      found: foundReducer,
    }),
    preloadedState,
    compose(
      createHistoryEnhancer({
        protocol: historyProtocol,
        middlewares: [queryMiddleware],
      }),
      createMatchEnhancer(new Matcher(routeConfig)),
    ),
  );
}
