import * as PropTypes from '../src/PropTypes';

describe('PropTypes', () => {
  it('should have the correct exports', () => {
    expect(PropTypes.matchShape).toBeDefined();
    expect(PropTypes.matcherShape).toBeDefined();
    expect(PropTypes.routerShape).toBeDefined();
  });
});
