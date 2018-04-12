import createBrowserRouter from 'found/lib/createBrowserRouter';
import React from 'react';
import { hot } from 'react-hot-loader';

import routeConfig from './routeConfig';

const BrowserRouter = createBrowserRouter({
  routeConfig,

  renderError: (
    { error }, // eslint-disable-line react/prop-types
  ) => <div>{error.status === 404 ? 'Not found' : 'Error'}</div>,
});

export default hot(module)(BrowserRouter);
