import FarceActions from 'farce/lib/Actions';
import createHistoryEnhancer from 'farce/lib/createHistoryEnhancer';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, compose, createStore } from 'redux';

import createConnectedRouter from './createConnectedRouter';
import createMatchEnhancer from './createMatchEnhancer';
import Matcher from './Matcher';
import matchReducer from './matchReducer';

export default function createFarceRouter({
  historyProtocol, historyMiddlewares = [], routeConfig, ...options
}) {
  const ConnectedRouter = createConnectedRouter({ ...options, routeConfig });

  class FarceRouter extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.store = createStore(
        combineReducers({
          match: matchReducer,
        }),
        compose(
          createHistoryEnhancer(historyProtocol, historyMiddlewares),
          createMatchEnhancer(new Matcher(routeConfig)),
        ),
      );

      this.store.dispatch(FarceActions.init());
    }

    render() {
      return (
        <Provider store={this.store}>
          <ConnectedRouter {...this.props} />
        </Provider>
      );
    }
  }

  return FarceRouter;
}
