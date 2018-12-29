import BrowserProtocol from 'farce/lib/BrowserProtocol';
import React from 'react';

import createFarceRouter from './createFarceRouter';
import resolver from './resolver';

export default function createBrowserRouter(options) {
  const FarceRouter = createFarceRouter({
    ...options,
    historyProtocol: new BrowserProtocol(),
  });

  function BrowserRouter(props) {
    return <FarceRouter resolver={resolver} {...props} />;
  }

  return BrowserRouter;
}
