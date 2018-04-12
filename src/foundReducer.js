import ActionTypes from './ActionTypes';

export default function foundReducer(state = null, action) {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.UPDATE_MATCH:
      // For the initial match, set resolvedMatch too. There's no previous
      // result to keep rendered, plus this simplifies server rendering.
      return {
        match: payload,
        resolvedMatch: state ? state.resolvedMatch : payload,
      };
    case ActionTypes.RESOLVE_MATCH:
      // It doesn't make sense to resolve a match if there wasn't already an
      // unresolved match.
      return (
        state && {
          match: state.match,
          resolvedMatch: payload,
        }
      );
    default:
      return state;
  }
}
