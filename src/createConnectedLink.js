import { connect } from 'react-redux';

import BaseLink from './BaseLink';

export default function createConnectedLink({
  getMatch = ({ match }) => match,
}) {
  return connect(
    state => ({ match: getMatch(state) }),
    null,
    (stateProps, dispatchProps, ownProps) => ({
      ...ownProps,
      ...stateProps,
      // We don't want dispatch here.
    }),
  )(BaseLink);
}
