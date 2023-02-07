// eslint-disable-next-line max-classes-per-file
import React from 'react';

import type { RouteObject, RouteProps } from './typeUtils';

/**
 * Convenience class for creating normal routes with JSX. When not using JSX,
 * use a POJSO instead of this class.
 */

class Route {
  constructor(props: RouteProps) {
    Object.assign(this, props);
  }
}
declare class RouteType extends React.Component<RouteProps> {
  constructor(options: RouteObject | RouteProps);
}

export default Route as typeof RouteType;

if (__DEV__) {
  // Workaround to make React Proxy give me the original class, to allow
  // makeRouteConfig to get the actual class, when using JSX for routes.
  (Route.prototype as any).isReactComponent = {};
}
