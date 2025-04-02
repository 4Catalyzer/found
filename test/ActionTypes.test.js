import ActionTypes from '../src/ActionTypes';
import { describe, expect, it } from 'vitest';
describe('ActionTypes', () => {
  it('should have the correct exports', () => {
    expect(ActionTypes.UPDATE_MATCH).toBeDefined();
    expect(ActionTypes.RESOLVE_MATCH).toBeDefined();
  });
});
