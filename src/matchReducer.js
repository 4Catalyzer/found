import ActionTypes from './ActionTypes';

export default function matchReducer(state = null, action) {
  if (action.type === ActionTypes.UPDATE_MATCH) {
    return action.payload;
  }

  return state;
}
