import Matcher from '../src/Matcher';

describe('Matcher', () => {
  describe('route hierarchies', () => {
    const matcher = new Matcher([
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
    ]);

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
        pathname: '/a',
      })).toMatchObject({
        routeParams: [
          { foo: 'a' },
        ],
        params: {
          foo: 'a',
        },
      });

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

  describe('trailing slash handling', () => {
    describe('routes without trailing slashes', () => {
      const matcher = new Matcher([{
        path: 'foo',
        children: [{
          path: 'bar',
        }],
      }]);

      [
        ['parent without trailing slash', '/foo', [0]],
        ['parent with trailing slash', '/foo/', [0]],
        ['child without trailing slash', '/foo/bar', [0, 0]],
        ['child with trailing slash', '/foo/bar/', [0, 0]],
      ].forEach(([scenario, pathname, expectedRouteIndices]) => {
        it(`should match ${scenario}`, () => {
          expect(matcher.match({
            pathname,
          })).toMatchObject({
            routeIndices: expectedRouteIndices,
          });
        });
      });

      [
        ['parent with extraneous trailing slashes', '/foo//'],
        ['child with extraneous trailing slashes', '/foo/bar//'],
        ['extraneous slashes between parent and child ', '/foo//bar/'],
      ].forEach(([scenario, pathname]) => {
        it(`should not match ${scenario}`, () => {
          expect(matcher.match({
            pathname,
          })).toBeNull();
        });
      });
    });

    describe('routes with trailing slashes', () => {
      const matcher = new Matcher([{
        path: 'foo/',
        children: [{
          path: 'bar/',
        }],
      }]);

      [
        ['parent with trailing slash', '/foo/', [0]],
        ['child with trailing slash', '/foo/bar/', [0, 0]],
      ].forEach(([scenario, pathname, expectedRouteIndices]) => {
        it(`should match ${scenario}`, () => {
          expect(matcher.match({
            pathname,
          })).toMatchObject({
            routeIndices: expectedRouteIndices,
          });
        });
      });

      [
        ['parent without trailing slash', '/foo'],
        ['child without trailing slash', '/foo/bar'],
        ['parent with extraneous trailing slashes', '/foo//'],
        ['child with extraneous trailing slashes', '/foo/bar//'],
        ['extraneous slashes between parent and child ', '/foo//bar/'],
      ].forEach(([scenario, pathname]) => {
        it(`should not match ${scenario}`, () => {
          expect(matcher.match({
            pathname,
          })).toBeNull();
        });
      });
    });
  });

  describe('#joinPaths', () => {
    const matcher = new Matcher();

    [
      ['no extra slashes', '/foo', 'bar'],
      ['trailing slash on parent', '/foo/', 'bar'],
      ['leading slash on child', '/foo', '/bar'],
      ['slashes everywhere', '/foo/', '/bar'],
    ].forEach(([scenario, basePath, path]) => {
      it(`should support ${scenario}`, () => {
        expect(matcher.joinPaths(
          basePath, path,
        )).toBe('/foo/bar');
      });
    });
  });

  describe('#isActive', () => {
    const matcher = new Matcher([]);

    describe('active locations', () => {
      [
        [
          'path match',
          { pathname: '/foo/bar' },
          { pathname: '/foo/bar' },
        ],
        [
          'parent path match',
          { pathname: '/foo/bar' },
          { pathname: '/foo' },
        ],
        [
          'exact path match',
          { pathname: '/foo/bar' },
          { pathname: '/foo/bar' },
          { exact: true },
        ],
        [
          'null query match',
          { pathname: '/foo', query: { foo: 'bar' } },
          { pathname: '/foo' },
        ],
        [
          'empty query match',
          { pathname: '/foo', query: { foo: 'bar' } },
          { pathname: '/foo', query: {} },
        ],
        [
          'empty query match with explicit undefined',
          { pathname: '/foo', query: { foo: undefined } },
          { pathname: '/foo', query: {} },
        ],
        [
          'query match',
          { pathname: '/foo', query: { foo: 'bar' } },
          { pathname: '/foo', query: { foo: 'bar' } },
        ],
        [
          'query match with extraneous query item',
          { pathname: '/foo', query: { foo: 'bar', bar: 'foo' } },
          { pathname: '/foo', query: { foo: 'bar' } },
        ],
        [
          'absent query match with implicit undefined',
          { pathname: '/foo', query: {} },
          { pathname: '/foo', query: { foo: undefined } },
        ],
        [
          'absent query match with explicit undefined',
          { pathname: '/foo', query: { foo: undefined } },
          { pathname: '/foo', query: { foo: undefined } },
        ],
      ].forEach(([scenario, matchLocation, location, options]) => {
        it(`should be active on ${scenario}`, () => {
          expect(matcher.isActive(
            { location: matchLocation }, location, options,
          )).toBe(true);
        });
      });
    });

    describe('inactive locations', () => {
      [
        [
          'path mismatch',
          { pathname: '/bar' },
          { pathname: '/foo' },
        ],
        [
          'exact parent path match',
          { pathname: '/foo/bar' },
          { pathname: '/foo' },
          { exact: true },
        ],
        [
          'exact path mismatch',
          { pathname: '/bar' },
          { pathname: '/foo' },
          { exact: true },
        ],
        [
          'query mismatch',
          { pathname: '/foo', query: { foo: 'foo' } },
          { pathname: '/foo', query: { foo: 'bar' } },
        ],
        [
          'missing query item',
          { pathname: '/foo', query: {} },
          { pathname: '/foo', query: { foo: 'bar' } },
        ],
        [
          'expected query item explicitly undefined',
          { pathname: '/foo', query: { foo: undefined } },
          { pathname: '/foo', query: { foo: 'bar' } },
        ],
        [
          'expected undefined query item present',
          { pathname: '/foo', query: { foo: 'bar' } },
          { pathname: '/foo', query: { foo: undefined } },
        ],
      ].forEach(([scenario, matchLocation, location, options]) => {
        it(`should not be active on ${scenario}`, () => {
          expect(matcher.isActive(
            { location: matchLocation }, location, options,
          )).toBe(false);
        });
      });
    });
  });
});
