import FarceActions from 'farce/lib/Actions';
import React from 'react';
import { connect } from 'react-redux';

import createBaseRouter from './createBaseRouter';

export default function createConnectedRouter({
  getMatch = ({ match }) => match,
  ...options
}) {
  // createHref, createLocation, and isActive are taken directly from the store
  // to avoid potential issues with middlewares in the chain messing with the
  // return value from dispatch.
  const propTypes = {
    store: React.PropTypes.shape({
      farce: React.PropTypes.shape({
        createHref: React.PropTypes.func.isRequired,
        createLocation: React.PropTypes.func.isRequired,
      }).isRequired,
      found: React.PropTypes.shape({
        isActive: React.PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  const ConnectedRouter = connect(
    state => ({ match: getMatch(state) }),
    {
      push: FarceActions.push,
      replace: FarceActions.replace,
      go: FarceActions.go,
    },
    (stateProps, dispatchProps, { store, ...ownProps }) => ({
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      createHref: store.farce.createHref,
      createLocation: store.farce.createLocation,
      isActive: store.found.isActive,
    }),
  )(createBaseRouter(options));

  ConnectedRouter.propTypes = propTypes;

  return ConnectedRouter;
}
