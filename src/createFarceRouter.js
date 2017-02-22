// @flow
import FarceActions from 'farce/lib/Actions';
import React from 'react';
import { Provider } from 'react-redux';

import createConnectedRouter from './createConnectedRouter';
import createFarceStore from './utils/createFarceStore';

export default function createFarceRouter({
  store,
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  ...options
}: any) {
  const ConnectedRouter = createConnectedRouter(options);

  class FarceRouter extends React.Component {
    constructor(props: any, context: any) {
      super(props, context);

      this.store = store || createFarceStore({
        historyProtocol,
        historyMiddlewares,
        historyOptions,
        routeConfig,
      });
    }

    componentWillUnmount() {
      this.store.dispatch(FarceActions.dispose());
    }

    store: any;

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
