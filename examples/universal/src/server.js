import express from 'express';
import { getFarceResult } from 'found/lib/server';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

import render from './render';
import routeConfig from './routeConfig';

const PORT = 3000;

const app = express();

const webpackConfig = {
  entry: './src/client',

  output: {
    path: path.resolve('build'),
    publicPath: '/static',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
    ],
  },
};

app.use(webpackMiddleware(webpack(webpackConfig), {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(async (req, res) => {
  const { redirect, status, element } = await getFarceResult({
    url: req.url,
    routeConfig,
    render,
  });

  if (redirect) {
    res.redirect(302, redirect.url);
    return;
  }

  res.status(status).send(`
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Found Universal Example</title>
</head>

<body>
<div id="root">${ReactDOMServer.renderToString(element)}</div>

<script src="/static/bundle.js"></script>
</body>

</html>
  `);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`); // eslint-disable-line no-console
});
