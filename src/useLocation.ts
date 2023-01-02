import { Location } from 'farce';

import useMatch from './useMatch';

export default function useLocation(): Location | undefined {
  return useMatch()?.location;
}
