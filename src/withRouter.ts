import mapContextToProps from '@restart/context/mapContextToProps';

import RouterContext from './RouterContext';

export default function withRouter(Component: React.ComponentType<any>) {
  return mapContextToProps(
    {
      consumers: RouterContext,
      mapToProps: (context: typeof RouterContext) => context,
      displayName: `withRouter(${Component.displayName || Component.name})`,
    },
    Component,
  );
}
