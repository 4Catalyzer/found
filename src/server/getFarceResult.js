// @flow
import FarceActions from 'farce/lib/Actions';
import ServerProtocol from 'farce/lib/ServerProtocol';
import React from 'react';
import { Provider } from 'react-redux';

import getStoreRenderArgs from '../getStoreRenderArgs';
import RedirectException from '../RedirectException';
import defaultResolveElements from '../resolveElements';
import createFarceStore from '../utils/createFarceStore';
import RouterProvider from './RouterProvider';

// TODO: eslint-plugin-react should not think async functions are components.
// This is not a component.
/* eslint-disable react/prop-types */
export default async function getFarceResult({
  url,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  matchContext,
  resolveElements = defaultResolveElements,
  render,
}: {
  url: string,
  historyMiddlewares: any,
  historyOptions: any,
  routeConfig: any,
  matchContext: any,
  resolveElements: any,
  render: any,
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
      resolveElements,
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
/* eslint-enable react/prop-types */
