import BrowserProtocol from 'farce/BrowserProtocol';

import { BrowserRouter } from './createBrowserRouter';
import createInitialFarceRouter, {
  InitialFarceRouterOptions,
} from './createInitialFarceRouter';
import resolver from './resolver';

export type InitialBrowserRouterOptions = Omit<
  InitialFarceRouterOptions,
  'resolver' | 'historyProtocol'
>;

export default function createInitialBrowserRouter(
  options: InitialBrowserRouterOptions,
): Promise<BrowserRouter> {
  return createInitialFarceRouter({
    ...options,
    historyProtocol: new BrowserProtocol(),
    resolver,
  });
}
