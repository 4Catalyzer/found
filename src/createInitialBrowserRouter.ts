import BrowserProtocol from 'farce/BrowserProtocol';

import createInitialFarceRouter from './createInitialFarceRouter';
import resolver from './resolver';
import { BrowserRouter, InitialBrowserRouterOptions } from './typeUtils';

export default function createInitialBrowserRouter(
  options: InitialBrowserRouterOptions,
): Promise<BrowserRouter> {
  return createInitialFarceRouter({
    ...options,
    historyProtocol: new BrowserProtocol(),
    resolver,
  });
}
