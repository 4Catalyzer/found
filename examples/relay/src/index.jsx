import './index.css';
import { createBrowserRouter, Link } from 'found';
import React from 'react';

import {
  graphql,
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

import { RelayEnvironmentProvider, loadQuery } from 'react-relay/hooks';
import { createRoot } from 'react-dom/client';

import createWorker from 'swapi-graphql-mock-api';

import AppPage from './AppPage';
import FilmsPage from './FilmsPage';
import FilmPage from './FilmPage';

createWorker({ timeout: 100 }).start();

const environment = new Environment({
  network: Network.create(async (params, variables) => {
    const response = await fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: params.text,
        operationName: params.name,
        variables,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }),
  store: new Store(new RecordSource()),
});

function render({ props, Component }) {
  if (!props || !Component) return <div>Loading…</div>;

  return <Component {...props} />;
}

async function loadRouteQuery(env, query, variables) {
  const queryRef = loadQuery(env, query, variables);

  if (queryRef.source) {
    await queryRef.source.toPromise();
  }

  return queryRef;
}

const BrowserRouter = createBrowserRouter({
  routeConfig: [
    {
      path: '/',
      render,
      Component: AppPage,
      children: [
        {
          Component: () => <div>Main</div>,
        },
        {
          path: 'films',
          render,
          Component: FilmsPage,
          getData: async ({ context }) => {
            const queryRef = loadQuery(context.relay, FilmsPage.query);

            if (queryRef.source) {
              await queryRef.source.toPromise();
            }

            return queryRef;
          },

          children: [
            {
              path: ':filmId?',
              render,
              Component: FilmPage,
              getData: ({ params, context }) => {
                return loadRouteQuery(context.relay, FilmPage.query, {
                  filmId: params.filmId,
                });
              },
            },
          ],
        },
      ],
    },
  ],

  /* eslint-disable react/prop-types */
  renderError: ({ error }) => (
    <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
  ),
  /* eslint-enable react/prop-types */
});

const root = createRoot(document.getElementById('root'));

root.render(
  // <StrictMode>
  <RelayEnvironmentProvider environment={environment}>
    <BrowserRouter matchContext={{ relay: environment }} />
  </RelayEnvironmentProvider>,
  // </StrictMode>
);
