declare module 'found/lib/server' {
  import * as React from 'react';
  import { FarceCreateRouterArgs, Resolver, RenderArgs } from 'found';

  interface GetFarceResultArgs
    extends Pick<
      FarceCreateRouterArgs,
      'historyMiddlewares' | 'historyOptions' | 'routeConfig' | 'render'
    > {
    url: string;
    resolver: Resolver;
    matchContext?: any;
  }

  function getFarceResult(
    args: GetFarceResultArgs,
  ): {
    status: number;
    element: React.ComponentType;
    redirect: {
      url: string;
    };
  };

  interface RouterProviderProps {
    renderArgs: RenderArgs;
    matchContext?: any;
  }

  const RouterProvider: React.FunctionComponent<
    React.PropsWithChildren<RouterProviderProps>
  >;
}
