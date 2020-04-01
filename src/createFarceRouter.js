import FarceActions from 'farce/Actions';
import React from 'react';
import { Provider } from 'react-redux';

import createConnectedRouter from './createConnectedRouter';
import createFarceStore from './createFarceStore';

export default function createFarceRouter({
  store,
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  ...options
}) {
  const ConnectedRouter = createConnectedRouter(options);

  class FarceRouter extends React.Component {
    constructor(props) {
      super(props);

      this.store =
        store ||
        createFarceStore({
          historyProtocol,
          historyMiddlewares,
          historyOptions,
          routeConfig,
        });
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
