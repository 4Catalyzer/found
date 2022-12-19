import type { RouteProps } from './typeUtils';

/**
 * Convenience class for creating normal routes with JSX. When not using JSX,
 * use a POJSO instead of this class.
 */
export default class Route {
  constructor(props: RouteProps) {
    Object.assign(this, props);
  }
}

if (__DEV__) {
  // Workaround to make React Proxy give me the original class, to allow
  // makeRouteConfig to get the actual class, when using JSX for routes.
  (Route.prototype as any).isReactComponent = {};
}
