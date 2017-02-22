// @flow
import getRenderArgs from './getRenderArgs';
import createStoreRouterObject from './utils/createStoreRouterObject';

// This function returns a promise. It doesn't need to be an async function
// because it doesn't use the promise's value.
export default function getStoreRenderArgs({
  store,
  getFound = ({ found }) => found,
  matchContext,
  resolveElements,
}: Object) {
  const router = createStoreRouterObject(store);
  const match = getFound(store.getState()).resolvedMatch;

  return getRenderArgs({
    router,
    match,
    matchContext,
    resolveElements,
  });
}
