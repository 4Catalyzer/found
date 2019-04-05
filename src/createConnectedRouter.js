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
  return connect(
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
      getDisplayName: () => 'ConnectedRouter',
    },
  )(createBaseRouter(options));
}
