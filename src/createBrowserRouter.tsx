import BrowserProtocol from 'farce/BrowserProtocol';
import React from 'react';

import createFarceRouter from './createFarceRouter';
import resolver from './resolver';
import {
  BrowserRouter,
  BrowserRouterOptions,
  FarceRouter,
  FarceRouterProps,
} from './typeUtils';

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
