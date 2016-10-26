import FarceActions from 'farce/lib/Actions';
import { connect } from 'react-redux';

import createBaseRouter from './createBaseRouter';

export default function createConnectedRouter({
  getMatch = ({ match }) => match,
  ...options
}) {
  return connect(
    state => ({ match: getMatch(state) }),
    { replace: FarceActions.replace },
  )(createBaseRouter(options));
}
