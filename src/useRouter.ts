import { useContext } from 'react';
import { RouterState } from './generics';

import RouterContext from './RouterContext';

/**
 * Returns the Router and current route match from context
 */
export default function useRouter<TContext = any>(): RouterState<TContext> {
  return useContext(RouterContext);
}
