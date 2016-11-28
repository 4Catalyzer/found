import ActionTypes from '../src/ActionTypes';


it('UPDATE_MATCH, RESOLVE_MATCH are defined', () => {
  expect(ActionTypes.UPDATE_MATCH).toBeDefined();
  expect(ActionTypes.RESOLVE_MATCH).toBeDefined();
});
