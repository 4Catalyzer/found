import FarceActions from 'farce/Actions';
import ServerProtocol from 'farce/ServerProtocol';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { routerShape } from './PropTypes';
import RouterContext from './RouterContext';
import createFarceStore from './createFarceStore';
import createRender from './createRender';
import getStoreRenderArgs from './getStoreRenderArgs';
import defaultResolver from './resolver';
import { RenderArgs } from './typeUtils';

const propTypes = {
  renderArgs: PropTypes.shape({
    router: routerShape,
  }),
  children: PropTypes.node,
};

interface RouterProviderProps {
  renderArgs: RenderArgs;
  children: React.ReactNode;
}

function RouterProvider({ renderArgs, children }: RouterProviderProps) {
  return (
    <RouterContext.Provider
      value={useMemo(
        () => ({
          router: renderArgs.router,
          match: renderArgs,
        }),
        [renderArgs],
      )}
    >
      {children}
    </RouterContext.Provider>
  );
}

RouterProvider.propTypes = propTypes;

export { RouterProvider };

interface FarceResult {
  status: number;
  element?: any;
  redirect?: any;
}

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
}): Promise<FarceResult> {
  const store = createFarceStore({
    historyProtocol: new ServerProtocol(url),
    historyMiddlewares,
    historyOptions,
    routeConfig,
  });

  let renderArgs: RenderArgs;

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
    status:
      'error' in renderArgs && renderArgs.error
        ? renderArgs.error.status
        : 200,
    element: (
      <RouterProvider renderArgs={renderArgs}>
        {render(renderArgs)}
      </RouterProvider>
    ),
  };
}
