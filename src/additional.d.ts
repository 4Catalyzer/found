/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */

declare global {
  declare let __DEV__: boolean;
  interface Window {
    __FOUND_HOT_RELOAD__: boolean;
    __FOUND_REPLACE_ROUTE_CONFIG__?: (
      routeConfig: RouteConfig,
    ) => void | undefined;
  }
}

// Force this to be a module
export {};
