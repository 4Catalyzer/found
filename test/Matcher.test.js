import Matcher from '../src/Matcher';

describe('Matcher', () => {
  describe('route hierarchies', () => {
    let matcher;

    beforeEach(() => {
      const routeConfig = [
        {
          path: 'foo',
          children: [
            {
              children: [
                {},
              ],
            },
            {
              path: 'bar',
            },
          ],
        },
        {
          path: 'bar',
          children: [
            {
              path: 'baz',
            },
          ],
        },
        {
          path: 'foo/baz',
        },
      ];

      matcher = new Matcher(routeConfig);
    });

    [
      ['pathless children', '/foo', [0, 0, 0]],
      ['nested matching', '/foo/bar', [0, 1]],
      ['non-leaf routes', '/bar', [1]],
      ['route fallthrough', '/foo/baz', [2]],
    ].forEach(([scenario, pathname, expectedRouteIndices]) => {
      it(`should support ${scenario}`, () => {
        expect(matcher.match({
          pathname,
        })).toMatchObject({
          routeIndices: expectedRouteIndices,
        });
      });
    });
  });

  describe('route params', () => {
    it('should match route params', () => {
      const matcher = new Matcher([{
        path: ':foo',
        children: [{
          path: ':bar',
        }],
      }]);

      expect(matcher.match({
        pathname: '/a/b',
      })).toMatchObject({
        routeParams: [
          { foo: 'a' },
          { bar: 'b' },
        ],
        params: {
          foo: 'a',
          bar: 'b',
        },
      });
    });

    it('should support param name collisions', () => {
      const matcher = new Matcher([{
        path: ':foo',
        children: [{
          path: ':foo',
          children: [{
            path: ':bar',
          }],
        }],
      }]);

      expect(matcher.match({
        pathname: '/a/b/c',
      })).toMatchObject({
        routeParams: [
          { foo: 'a' },
          { foo: 'b' },
          { bar: 'c' },
        ],
        params: {
          foo: 'b',
          bar: 'c',
        },
      });
    });

    it('should support anonymous params', () => {
      const matcher = new Matcher([{
        path: ':foo',
        children: [{
          path: '([^/]+)',
          children: [{
            path: '([^/]+)',
          }],
        }],
      }]);

      expect(matcher.match({
        pathname: '/a/b/c',
      })).toMatchObject({
        routeParams: [
          { foo: 'a' },
          { 0: 'b' },
          { 0: 'c' },
        ],
        params: {
          foo: 'a',
          0: 'c',
        },
      });
    });

    it('should support custom params', () => {
      const matcher = new Matcher([{
        path: ':foo(\\d+)',
      }]);

      expect(matcher.match({
        pathname: '/abc',
      })).toBeNull();

      expect(matcher.match({
        pathname: '/123',
      })).toMatchObject({
        params: {
          foo: '123',
        },
      });
    });

    it('should support path params', () => {
      const matcher = new Matcher([{
        path: ':foo',
        children: [{
          path: '*',
        }],
      }]);

      expect(matcher.match({
        pathname: '/a/b/c',
      })).toMatchObject({
        routeParams: [
          { foo: 'a' },
          { 0: 'b/c' },
        ],
        params: {
          foo: 'a',
          0: 'b/c',
        },
      });
    });
  });
});
