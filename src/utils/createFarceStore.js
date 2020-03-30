import FarceActions from 'farce/Actions';
import createHistoryEnhancer from 'farce/createHistoryEnhancer';
import queryMiddleware from 'farce/queryMiddleware';
import { combineReducers, compose, createStore } from 'redux';

import Matcher from '../Matcher';
import createMatchEnhancer from '../createMatchEnhancer';
import foundReducer from '../foundReducer';

export default function createFarceStore({
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
}) {
  const store = createStore(
    combineReducers({
      found: foundReducer,
    }),
    compose(
      createHistoryEnhancer({
        ...historyOptions,
        protocol: historyProtocol,
        middlewares: historyMiddlewares || [queryMiddleware],
      }),
      createMatchEnhancer(new Matcher(routeConfig)),
    ),
  );

  store.dispatch(FarceActions.init());

  return store;
}
