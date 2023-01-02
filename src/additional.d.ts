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

declare module '@restart/context/mapContextToProps' {
  export default function mapContextToProps<
    TComponent,
    TContext,
    TContextProps,
    TOwnProps,
  >(
    data: {
      consumers: TContext;
      mapToProps: (context: TContext) => TContext;
      displayName: string;
    },
    Component: TComponent,
  ): ContextInjectedComponent<TComponent, TContextProps, TOwnProps>;
}

// Force this to be a module
export {};
