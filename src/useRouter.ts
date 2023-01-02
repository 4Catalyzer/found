import { useContext } from 'react';

import RouterContext, { IRouterContext } from './RouterContext';

/**
 * Returns the Router and current route match from context
 */
export default function useRouter<TContext = any>(): IRouterContext<TContext> {
  return useContext<IRouterContext<TContext>>(RouterContext);
}
