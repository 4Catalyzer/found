import React from 'react';
import ReactDOM from 'react-dom';
import createConnectedRouter from 'found/lib/createConnectedRouter';
import getStoreRenderArgs from 'found/lib/getStoreRenderArgs';
import resolveElements from 'found/lib/resolveElements';
import { Provider } from 'react-redux';
import { BrowserProtocol } from 'farce';

import render from './render';
import genStore from './genStore';

const store = genStore(new BrowserProtocol(), window.__PRELOADED_STATE__);
const matchContext = { store };
const ConnectedRouter = createConnectedRouter({ render });

(async () => {
  const initialRenderArgs = await getStoreRenderArgs({
    store,
    matchContext,
    resolveElements,
  });

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter
        matchContext={matchContext}
        resolveElements={resolveElements}
        initialRenderArgs={initialRenderArgs}
      />
    </Provider>,
    document.getElementById('root'),
  );
})();
