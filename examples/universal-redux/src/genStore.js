import { createHistoryEnhancer, queryMiddleware } from 'farce';
import createMatchEnhancer from 'found/lib/createMatchEnhancer';
import foundReducer from 'found/lib/foundReducer';
import Matcher from 'found/lib/Matcher';
import { combineReducers, compose, createStore } from 'redux';

import routeConfig from './routeConfig';

export default function genStore(historyProtocol, preloadedState) {
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
