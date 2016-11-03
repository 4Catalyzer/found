import FarceActions from 'farce/lib/Actions';
import { connect } from 'react-redux';

import ActionTypes from './ActionTypes';
import createBaseRouter from './createBaseRouter';

function resolveMatch(match) {
  return {
    type: ActionTypes.RESOLVE_MATCH,
    payload: match,
  };
}

export default function createConnectedRouter({
  getFound = ({ found }) => found,
  ...options
}) {
  const ConnectedRouter = connect(
    (state) => {
      const { match, resolvedMatch } = getFound(state);
      return { match, resolvedMatch };
    },
    {
      push: FarceActions.push,
      replace: FarceActions.replace,
      go: FarceActions.go,
      onResolveMatch: resolveMatch,
    },
    null,
    {
      // Don't block context propagation from above. The router should seldom
      // be unnecessarily rerendering anyway.
      pure: false,
    },
  )(createBaseRouter(options));

  // This implementation is very messy, but it provides the cleanest API to get
  // these methods into the base router from the store, since they're already
  // on the store context.

  // Overwriting the method instead of extending the class is used to avoid
  // issues with compatibility on IE <= 10.
  const baseAddExtraProps = ConnectedRouter.prototype.addExtraProps;

  function addExtraProps(props) {
    // It's safe to read from the context because these won't change.
    const { farce, found } = this.props.store || this.context.store;

    return {
      ...baseAddExtraProps.call(this, props),

      // Take createHref, createLocation, and isActive directly from the store
      // to avoid potential issues with middlewares in the chain messing with
      // the return value from dispatch.
      createHref: farce.createHref,
      createLocation: farce.createLocation,
      isActive: found.isActive,

      // There's not really a better way to model this. Functions can't live in
      // the store, as they're not serializable.
      addTransitionHook: farce.addTransitionHook,
    };
  }

  ConnectedRouter.prototype.addExtraProps = addExtraProps;

  return ConnectedRouter;
}
