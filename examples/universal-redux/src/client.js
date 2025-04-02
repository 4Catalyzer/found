import { BrowserProtocol } from 'farce';
import { createBaseRouter } from 'found';
import getStoreRenderArgs from 'found/getStoreRenderArgs';
import resolver from 'found/resolver';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useStore, shallowEqual } from 'react-redux';

import configureStore from './configureStore';
import render from './render';

const store = configureStore(
  new BrowserProtocol(),
  window.__PRELOADED_STATE__,
);
const matchContext = { store };

const Router = createBaseRouter({
  render: render({
    renderError: ({ error }) => (
      <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
    ),
  }),
});

const getFoundState = (state) => {
  return state.found;
};

function ConnectedRouter(props) {
  const store = useStore();
  const foundState = useSelector(getFoundState, shallowEqual);

  return <Router {...props} {...foundState} store={store} />;
}

(async () => {
  const initialRenderArgs = await getStoreRenderArgs({
    store,
    matchContext,
    resolver,
  });

  ReactDOM.hydrate(
    <Provider store={store}>
      <ConnectedRouter
        matchContext={matchContext}
        resolver={resolver}
        initialRenderArgs={initialRenderArgs}
      />
    </Provider>,
    document.getElementById('root'),
  );
})();
