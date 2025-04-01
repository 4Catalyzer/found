import BrowserProtocol from 'farce/BrowserProtocol';

import createFarceRouter from './createFarceRouter';
import resolver from './resolver';
import {
  type BrowserRouter,
  type BrowserRouterOptions,
  type FarceRouterProps,
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
