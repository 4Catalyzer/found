import FarceActions from 'farce/Actions';
import { type Store, bindActionCreators } from 'redux';

import { type Router } from './typeUtils';

const NAVIGATION_ACTION_CREATORS = {
  push: FarceActions.push,
  replace: FarceActions.replace,
  go: FarceActions.go,
};

export default function createStoreRouterObject(store: Store): Router {
  // TODO: create an enhanced store type with found and farce maybe?
  const { farce, found } = store as any;
  const { matcher } = found;

  return {
    ...bindActionCreators(NAVIGATION_ACTION_CREATORS, store.dispatch),

    ...farce,
    ...found,

    // Expose isActive from matcher directly for convenience. This pattern is
    // faster than using matcher.isActive.bind(matcher).
    isActive: (match, location, options) =>
      matcher.isActive(match, location, options),
  };
}
