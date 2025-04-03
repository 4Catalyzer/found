import { useContext } from 'react';

import RouterContext, { type RouterContextValue } from './RouterContext';

/**
 * Returns the Router and current route match from context
 */
export default function useRouter<TMatchContext = any>() {
  const context = useContext<RouterContextValue<TMatchContext>>(RouterContext);

  return context;
}
