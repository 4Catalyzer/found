import BrowserProtocol from 'farce/BrowserProtocol';
import React from 'react';

import { RenderArgs } from './ElementsRenderer';
import createFarceRouter, {
  FarceRouterOptions,
  FarceRouterProps,
} from './createFarceRouter';
import resolver from './resolver';
import { Resolver } from './typeUtils';

export interface BrowserRouterProps
  extends Omit<FarceRouterProps, 'resolver'> {
  resolver?: Resolver;
}

export type BrowserRouter = React.ComponentType<BrowserRouterProps>;
export interface BrowserRouterOptions
  extends Omit<FarceRouterOptions, 'historyProtocol'> {
  render?: (args: RenderArgs) => React.ReactElement;
}

export default function createBrowserRouter(
  options: BrowserRouterOptions,
): BrowserRouter {
  const Router = createFarceRouter({
    ...options,
    historyProtocol: new BrowserProtocol(),
  });

  function BrowserRouterInstance(props: FarceRouterProps) {
    // @ts-ignore TODO: resolver will be always overwritten
    return <Router resolver={resolver} {...props} />;
  }

  return BrowserRouterInstance;
}
