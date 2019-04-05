import { useContext } from 'react';

import RouterContext from './RouterContext';

export default function useRouter() {
  return useContext(RouterContext);
}
