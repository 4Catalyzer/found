import useRouter from './useRouter';
import { Match } from './utilityTypes';

/** Returns the current route Match */
export default function useMatch<TContext = any>(): Match<TContext> | null {
  return useRouter().match;
}
