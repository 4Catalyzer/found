import express from 'express';
import { Actions as FarceActions, ServerProtocol } from 'farce';
import { getStoreRenderArgs, resolver, RedirectException } from 'found';
import { RouterProvider } from 'found/lib/server';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

import genStore from './genStore';
import render from './render';

const PORT = 3000;
const app = express();

const webpackConfig = {
  entry: [
    'babel-polyfill',
    './src/client',
  ],

  output: {
    path: '/',
    publicPath: '/static',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
    ],
  },
};

function renderPageToString(element, state) {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Found Universal Redux Example</title>
</head>

<body>
  <div id="root">${ReactDOMServer.renderToString(element)}</div>
  <script>
    window.__PRELOADED_STATE__ = ${serialize(state, { isJSON: true })};
  </script>
  <script src="/static/bundle.js"></script>
</body>

</html>
  `;
}

app.use(webpackMiddleware(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true },
}));

app.use(async (req, res) => {
  const store = genStore(new ServerProtocol(req.url));
  store.dispatch(FarceActions.init());
  const matchContext = { store };
  let renderArgs;

  try {
    renderArgs = await getStoreRenderArgs({
      store,
      matchContext,
      resolver,
    });
  } catch (e) {
    if (e instanceof RedirectException) {
      res.redirect(302, store.farce.createHref(e.location));
      return;
    }

    throw e;
  }

  res
    .status(renderArgs.error ? renderArgs.error.status : 200)
    .send(renderPageToString(
      <Provider store={store}>
        <RouterProvider router={renderArgs.router}>
          {render(renderArgs)}
        </RouterProvider>
      </Provider>,
      store.getState(),
    ));
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`); // eslint-disable-line no-console
});
