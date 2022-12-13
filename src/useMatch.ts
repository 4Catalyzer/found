import { Match } from './typeUtils';
import useRouter from './useRouter';

/** Returns the current route Match */
export default function useMatch<TContext = any>(): Match<TContext> {
  return useRouter().match;
}
