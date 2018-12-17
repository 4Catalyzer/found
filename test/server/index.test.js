import * as server from '../../src/server';

describe('found/server', () => {
  it('should have the correct exports', () => {
    expect(server.getFarceResult).toBeDefined();
  });
});
