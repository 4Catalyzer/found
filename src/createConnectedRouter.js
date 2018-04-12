import { connect } from 'react-redux';

import ActionTypes from './ActionTypes';
import createBaseRouter from './createBaseRouter';
import createStoreRouterObject from './utils/createStoreRouterObject';

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
    state => {
      const { match, resolvedMatch } = getFound(state);
      return { match, resolvedMatch };
    },
    {
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
    if (!this.router) {
      this.router = createStoreRouterObject(
        this.props.store || this.context.store,
      );
    }

    return {
      ...baseAddExtraProps.call(this, props),
      router: this.router,
    };
  }

  ConnectedRouter.prototype.addExtraProps = addExtraProps;

  return ConnectedRouter;
}
