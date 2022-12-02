import { useContext } from 'react';

import RouterContext from './RouterContext';
import { RouterState } from './typeUtils';

/**
 * Returns the Router and current route match from context
 */
export default function useRouter<TContext = any>(): RouterState<TContext> {
  return useContext<RouterState<TContext>>(RouterContext);
}
