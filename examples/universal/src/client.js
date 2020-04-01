import createInitialBrowserRouter from 'found/createInitialBrowserRouter';
import React from 'react';
import ReactDOM from 'react-dom';

import render from './render';
import routeConfig from './routeConfig';

(async () => {
  const BrowserRouter = await createInitialBrowserRouter({
    routeConfig,
    render,
  });

  ReactDOM.hydrate(<BrowserRouter />, document.getElementById('root'));
})();
