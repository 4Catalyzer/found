import useMatch from './useMatch';
import { Location } from './generics';

/** Returns the current location object */
export default function useLocation(): Location {
  return useMatch().location;
}
