import { type Reducer } from 'redux';

import ActionTypes from './ActionTypes';
import { type FoundState } from './typeUtils';

// TODO: Re-check types here.
const foundReducer = (
  state: any = null,
  action: { type: any; payload: any },
) => {
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
};

export default foundReducer as Reducer<FoundState>;
