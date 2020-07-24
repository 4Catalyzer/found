declare module 'found/server' {
  import * as React from 'react';
  import {
    FarceCreateRouterArgs,
    Omit,
    Resolver,
    RouterRenderArgs,
  } from 'found';

  interface GetFarceResultArgs
    extends Omit<FarceCreateRouterArgs, 'store' | 'historyProtocol'> {
    url: string;
    resolver?: Resolver;
    matchContext?: any;
  }

  interface FarceElementResult {
    status: number;
    element: React.ReactElement;
  }

  interface FarceRedirectResult {
    redirect: {
      status: number;
      url: string;
    };
  }

  function getFarceResult(
    args: GetFarceResultArgs,
  ): Promise<FarceElementResult | FarceRedirectResult>;

  interface RouterProviderProps {
    renderArgs: RouterRenderArgs;
    children?: React.ReactNode;
  }

  const RouterProvider: React.FunctionComponent<RouterProviderProps>;
}
