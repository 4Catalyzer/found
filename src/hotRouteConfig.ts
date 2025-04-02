import { type RouteConfig } from './typeUtils';

export default function hotRouteConfig(routeConfig: RouteConfig): RouteConfig {
  if (__DEV__ && typeof window !== 'undefined') {
    /* eslint-env browser */

    window.__FOUND_HOT_RELOAD__ = true;

    if (window.__FOUND_REPLACE_ROUTE_CONFIG__) {
      window.__FOUND_REPLACE_ROUTE_CONFIG__(routeConfig);
    }

    /* eslint-env browser: false */
  }

  return routeConfig;
}
