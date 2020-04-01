import { createHistoryEnhancer, queryMiddleware } from 'farce';
import Matcher from 'found/Matcher';
import createMatchEnhancer from 'found/createMatchEnhancer';
import foundReducer from 'found/foundReducer';
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
