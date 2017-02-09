// @flow
import FarceActions from 'farce/lib/Actions';
import createHistoryEnhancer from 'farce/lib/createHistoryEnhancer';
import queryMiddleware from 'farce/lib/queryMiddleware';
import { combineReducers, compose, createStore } from 'redux';

import createMatchEnhancer from '../createMatchEnhancer';
import foundReducer from '../foundReducer';
import Matcher from '../Matcher';

export default function createFarceStore({
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
}: {
  historyProtocol: any,
  historyMiddlewares: any,
  historyOptions: any,
  routeConfig: any,
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
      createMatchEnhancer(
        new Matcher(routeConfig),
      ),
    ),
  );

  store.dispatch(FarceActions.init());

  return store;
}
