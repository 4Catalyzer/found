import FarceActions from 'farce/lib/Actions';
import ServerProtocol from 'farce/lib/ServerProtocol';
import React from 'react';
import { Provider } from 'react-redux';

import getStoreRenderArgs from '../getStoreRenderArgs';
import RedirectException from '../RedirectException';
import defaultResolver from '../resolver';
import createFarceStore from '../utils/createFarceStore';
import RouterProvider from './RouterProvider';

export default async function getFarceResult({
  url,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  matchContext,
  resolver = defaultResolver,
  render,
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
    if (e instanceof RedirectException) {
      // The store is not exposed to the user, so we need to build the redirect
      // URL here.
      return {
        redirect: {
          url: store.farce.createHref(e.location),
        },
      };
    }

    throw e;
  } finally {
    // This is a no-op with ServerProtocol, but it doesn't hurt.
    store.dispatch(FarceActions.dispose());
  }

  return {
    status: renderArgs.error ? renderArgs.error.status : 200,
    element: (
      <Provider store={store}>
        <RouterProvider router={renderArgs.router}>
          {render(renderArgs)}
        </RouterProvider>
      </Provider>
    ),
  };
}
