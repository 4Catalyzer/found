import FarceActions from 'farce/Actions';
import ServerProtocol from 'farce/ServerProtocol';
import PropTypes from 'prop-types';
import React from 'react';

import { routerShape } from './PropTypes';
import RouterContext from './RouterContext';
import createFarceStore from './createFarceStore';
import createRender from './createRender';
import getStoreRenderArgs from './getStoreRenderArgs';
import defaultResolver from './resolver';

const propTypes = {
  renderArgs: PropTypes.shape({
    router: routerShape.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

function RouterProvider({ renderArgs, children }) {
  return (
    <RouterContext.Provider
      value={{
        router: renderArgs.router,
        match: renderArgs,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

RouterProvider.propTypes = propTypes;

export { RouterProvider };

export async function getFarceResult({
  url,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  matchContext,
  resolver = defaultResolver,
  renderPending,
  renderReady,
  renderError,
  render = createRender({
    renderPending,
    renderReady,
    renderError,
  }),
}) {
  const store = createFarceStore({
    historyProtocol: new ServerProtocol(url),
    historyMiddlewares,
    historyOptions,
    routeConfig,
  });

  let renderArgs;

  try {
    renderArgs = await getStoreRenderArgs({
      store,
      matchContext,
      resolver,
    });
  } catch (e) {
    if (e.isFoundRedirectException) {
      // The store is not exposed to the user, so we need to build the redirect
      // URL here.
      return {
        status: e.status,
        redirect: {
          url: store.farce.createHref(e.location),
        },
      };
    }

    /* istanbul ignore next: paranoid guard */
    throw e;
  } finally {
    // This is a no-op with ServerProtocol, but it doesn't hurt.
    store.dispatch(FarceActions.dispose());
  }

  return {
    status: renderArgs.error ? renderArgs.error.status : 200,
    element: (
      <RouterProvider renderArgs={renderArgs}>
        {render(renderArgs)}
      </RouterProvider>
    ),
  };
}
