import { Location } from 'farce';

import useMatch from './useMatch';

export default function useLocation(): Location {
  return useMatch().location;
}
