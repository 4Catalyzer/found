import FarceActions from 'farce/lib/Actions';
import { connect } from 'react-redux';

import createBaseRouter from './createBaseRouter';

export default function createConnectedRouter({
  getMatch = ({ match }) => match,
  ...options
}) {
  const ConnectedRouter = connect(
    state => ({ match: getMatch(state) }),
    {
      push: FarceActions.push,
      replace: FarceActions.replace,
      go: FarceActions.go,
    },
    null,
    {
      // <BaseRouter> already memoizes its render output, so there's no benefit
      // to doing further memoization here.
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
    };
  }

  ConnectedRouter.prototype.addExtraProps = addExtraProps;

  return ConnectedRouter;
}
