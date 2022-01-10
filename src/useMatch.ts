import { Match } from './generics';
import useRouter from './useRouter';

export default function useMatch<TContext = any>(): Match<TContext> {
  return useRouter().match;
}
