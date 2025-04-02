import { type Params } from './typeUtils';
import useMatch from './useMatch';

/** Returns the current route params */
export default function useParams(): Params | undefined {
  return useMatch()?.params;
}
