import { connect } from 'react-redux';

import injectRouterProp from './utils/injectRouterProp';

export default function createWithRouter({
  getFound = ({ found }) => found,
  matchKey = 'resolvedMatch',
}) {
  return injectRouterProp(
    connect(
      state => ({ match: getFound(state)[matchKey] }),
      null,
      (stateProps, dispatchProps, ownProps) => ({
        ...ownProps,
        ...stateProps,
        // We don't want dispatch here.
      }),
      // This needs to be pure, to avoid rerendering on changes to other matchKey
      // values in the store.
      {
        getDisplayName: name => `withRouter(${name})`,
      },
    ),
  );
}
