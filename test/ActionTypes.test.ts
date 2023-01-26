import ActionTypes from '../src/ActionTypes';

describe('ActionTypes', () => {
  it('should have the correct exports', () => {
    expect(ActionTypes.UPDATE_MATCH).toBeDefined();
    expect(ActionTypes.RESOLVE_MATCH).toBeDefined();
  });
});
