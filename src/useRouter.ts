import { useContext } from 'react';

import RouterContext, { type RouterContextState } from './RouterContext';

/**
 * Returns the Router and current route match from context
 */
export default function useRouter<
  TContext = any,
>(): RouterContextState<TContext> {
  return useContext<RouterContextState<TContext>>(RouterContext);
}
