import BrowserProtocol from 'farce/lib/BrowserProtocol';
import queryMiddleware from 'farce/lib/queryMiddleware';
import React from 'react';

import createFarceRouter from './createFarceRouter';
import createRender from './createRender';
import resolveElements from './resolveElements';

export default function createBrowserRouter({
  basename,
  historyMiddlewares,
  render,
  renderPending,
  renderReady,
  renderError,
  ...options
}) {
  const FarceRouter = createFarceRouter({
    ...options,
    historyProtocol: new BrowserProtocol({ basename }),
    historyMiddlewares: historyMiddlewares || [queryMiddleware],
    render: render || createRender({
      renderPending, renderReady, renderError,
    }),
  });

  function BrowserRouter(props) {
    return (
      <FarceRouter
        {...props}
        resolveElements={resolveElements}
      />
    );
  }

  return BrowserRouter;
}
