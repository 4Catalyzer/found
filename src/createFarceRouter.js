import FarceActions from 'farce/lib/Actions';
import createHistoryEnhancer from 'farce/lib/createHistoryEnhancer';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, compose, createStore } from 'redux';

import createConnectedRouter from './createConnectedRouter';
import createMatchEnhancer from './createMatchEnhancer';
import foundReducer from './foundReducer';
import Matcher from './Matcher';

export default function createFarceRouter({
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  ...options
}) {
  const matcher = new Matcher(routeConfig);

  const ConnectedRouter = createConnectedRouter({
    ...options, routeConfig, matcher,
  });

  class FarceRouter extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.store = createStore(
        combineReducers({
          found: foundReducer,
        }),
        compose(
          createHistoryEnhancer({
            ...historyOptions,
            protocol: historyProtocol,
            middlewares: historyMiddlewares,
          }),
          createMatchEnhancer(matcher),
        ),
      );

      this.store.dispatch(FarceActions.init());
    }

    componentWillUnmount() {
      this.store.dispatch(FarceActions.dispose());
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
