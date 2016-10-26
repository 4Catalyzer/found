import FarceActions from 'farce/lib/Actions';
import { connect } from 'react-redux';

import BaseLink from './BaseLink';

export default function createConnectedLink({
  getMatch = ({ match }) => match,
}) {
  return connect(
    state => ({ match: getMatch(state) }),
    { push: FarceActions.push },
  )(BaseLink);
}
