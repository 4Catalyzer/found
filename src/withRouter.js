import mapContextToProps from '@restart/context/mapContextToProps';

import RouterContext from './RouterContext';

export default function withRouter(Component) {
  return mapContextToProps(
    {
      consumers: RouterContext,
      mapToProps: (context) => context,
      displayName: `withRouter(${Component.displayName || Component.name})`,
    },
    Component,
  );
}
