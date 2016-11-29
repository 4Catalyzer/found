import * as jsx from '../../src/jsx';

describe('found/jsx', () => {
  it('should have the correct exports', () => {
    expect(jsx.makeRouteConfig).toBeDefined();
    expect(jsx.Redirect).toBeDefined();
    expect(jsx.Route).toBeDefined();
  });
});
