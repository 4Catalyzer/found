// @flow
import FarceActions from 'farce/lib/Actions';
import { bindActionCreators } from 'redux';

const NAVIGATION_ACTION_CREATORS = {
  push: FarceActions.push,
  replace: FarceActions.replace,
  go: FarceActions.go,
};

export default function createStoreRouterObject(store: any) {
  const { farce, found } = store;
  const { matcher } = found;

  return {
    ...bindActionCreators(NAVIGATION_ACTION_CREATORS, store.dispatch),

    ...farce,
    ...found,

    // Expose isActive from matcher directly for convenience. This pattern is
    // faster than using matcher.isActive.bind(matcher).
    isActive: (match, location, options) => (
      matcher.isActive(match, location, options)
    ),
  };
}
