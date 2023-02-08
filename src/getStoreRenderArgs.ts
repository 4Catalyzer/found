import { Store } from 'redux';

import { RenderArgs } from './ElementsRenderer';
import createStoreRouterObject from './createStoreRouterObject';
import getRenderArgs from './getRenderArgs';
import { FoundState, Resolver } from './utilityTypes';

export interface GetStoreRenderArgsOptions {
  store: Store;
  getFound?: (store: Store) => FoundState;
  matchContext: any;
  resolver: Resolver;
}

// This function returns a promise. It doesn't need to be an async function
// because it doesn't use the promise's value.
export default function getStoreRenderArgs({
  store,
  // TODO: check types of this
  getFound = ({ found }: any) => found,
  matchContext,
  resolver,
}: GetStoreRenderArgsOptions): Promise<RenderArgs> {
  const router = createStoreRouterObject(store);
  const match = getFound(store.getState()).resolvedMatch;

  return getRenderArgs(router, { match, matchContext, resolver });
}
