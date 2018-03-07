import BrowserProtocol from 'farce/lib/BrowserProtocol';
import React from 'react';

import createFarceRouter from './createFarceRouter';
import createRender from './createRender';
import resolver from './resolver';

export default function createBrowserRouter({
  render,
  renderPending,
  renderReady,
  renderError,
  ...options
}) {
  const FarceRouter = createFarceRouter({
    ...options,
    historyProtocol: new BrowserProtocol(),
    render:
      render ||
      createRender({
        renderPending,
        renderReady,
        renderError,
      }),
  });

  function BrowserRouter(props) {
    return <FarceRouter resolver={resolver} {...props} />;
  }

  return BrowserRouter;
}
