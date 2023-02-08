import useMatch from './useMatch';
import { Params } from './utilityTypes';

/** Returns the current route params */
export default function useParams(): Params | undefined {
  return useMatch()?.params;
}
