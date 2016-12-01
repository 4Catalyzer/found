import BrowserProtocol from 'farce/lib/BrowserProtocol';

import createInitialFarceRouter from './createInitialFarceRouter';
import resolveElements from './resolveElements';

export default async function createInitialBrowserRouter(options) {
  return createInitialFarceRouter({
    ...options,
    historyProtocol: new BrowserProtocol(),
    resolveElements,
  });
}
