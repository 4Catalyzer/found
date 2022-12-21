import { Protocol } from 'farce';
import FarceActions from 'farce/Actions';
import createHistoryEnhancer, {
  HistoryEnhancerOptions,
} from 'farce/createHistoryEnhancer';
import queryMiddleware from 'farce/queryMiddleware';
import { Middleware, combineReducers, compose, createStore } from 'redux';

import Matcher from './Matcher';
import createMatchEnhancer from './createMatchEnhancer';
import foundReducer from './foundReducer';
import { RouteConfig } from './typeUtils';

interface Props {
  matcherOptions?: any;
  routeConfig: RouteConfig;
  historyOptions?: Omit<HistoryEnhancerOptions, 'protocol' | 'middlewares'>;
  historyMiddlewares?: Middleware[];
  historyProtocol: Protocol;
}

function createFarceStore({
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  matcherOptions,
}: Props) {
  const store = createStore(
    combineReducers({
      found: foundReducer,
    }),
    compose(
      createHistoryEnhancer({
        ...historyOptions,
        protocol: historyProtocol,
        middlewares: historyMiddlewares || [queryMiddleware],
      }) as any,
      createMatchEnhancer(new Matcher(routeConfig, matcherOptions)),
    ),
  );

  store.dispatch(FarceActions.init());

  return store;
}

export default createFarceStore;
