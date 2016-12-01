import createInitialBrowserRouter from 'found/lib/createInitialBrowserRouter';
import React from 'react';
import ReactDOM from 'react-dom';

import render from './render';
import routeConfig from './routeConfig';

(async () => {
  const BrowserRouter = await createInitialBrowserRouter({
    routeConfig,
    render,
  });

  ReactDOM.render(
    <BrowserRouter />,
    document.getElementById('root'),
  );
})();
