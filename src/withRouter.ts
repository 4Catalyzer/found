import mapContextToProps from '@restart/context/mapContextToProps';
import { RouterState } from './generics';

import RouterContext from './RouterContext';

export default function withRouter<TProps extends RouterState>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<Omit<TProps, keyof RouterState>> {
  return mapContextToProps<any, any, any, any>(
    {
      consumers: RouterContext,
      mapToProps: (context) => context,
      displayName: `withRouter(${Component.displayName || Component.name})`,
    } as any,
    Component as any,
  ) as any;
}
