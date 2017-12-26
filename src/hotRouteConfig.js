export default function hotRouteConfig(routeConfig) {
  if (__DEV__ && typeof window !== 'undefined') {
    /* eslint-env browser */
    /* eslint-disable no-underscore-dangle */
    window.__FOUND_HOT_RELOAD__ = true;

    if (window.__FOUND_REPLACE_ROUTE_CONFIG__) {
      window.__FOUND_REPLACE_ROUTE_CONFIG__(routeConfig);
    }
    /* eslint-enable no-underscore-dangle */
    /* eslint-env browser: false */
  }

  return routeConfig;
}
