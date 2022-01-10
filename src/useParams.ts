import { Params } from './generics';
import useMatch from './useMatch';

/** Returns the current route params */
export default function useParams(): Params {
  return useMatch().params;
}
