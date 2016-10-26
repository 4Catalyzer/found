import BrowserProtocol from 'farce/lib/BrowserProtocol';
import React from 'react';

import createFarceRouter from './createFarceRouter';
import createRender from './createRender';
import resolveElements from './resolveElements';

export default function createBrowserRouter({ basename, ...options }) {
  const FarceRouter = createFarceRouter({
    ...options,
    historyProtocol: new BrowserProtocol({ basename }),
  });

  const propTypes = {
    renderError: React.PropTypes.func,
  };

  function BrowserRouter({ renderError, ...props }) {
    return (
      <FarceRouter
        {...props}
        resolveElements={resolveElements}
        render={createRender({ renderError })}
      />
    );
  }

  BrowserRouter.propTypes = propTypes;

  return BrowserRouter;
}
