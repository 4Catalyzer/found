import createBrowserRouter from 'found/createBrowserRouter';
import React from 'react';
import { hot } from 'react-hot-loader';

import routeConfig from './routeConfig';

const BrowserRouter = createBrowserRouter({
  routeConfig,

  /* eslint-disable react/prop-types */
  renderError: ({ error }) => (
    <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
  ),
  /* eslint-enable react/prop-types */
});

export default hot(module)(BrowserRouter);
