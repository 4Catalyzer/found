import BrowserProtocol from 'farce/lib/BrowserProtocol';

import createInitialFarceRouter from './createInitialFarceRouter';
import resolver from './resolver';

export default function createInitialBrowserRouter(options) {
  return createInitialFarceRouter({
    ...options,
    historyProtocol: new BrowserProtocol(),
    resolver,
  });
}
