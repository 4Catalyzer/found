import Matcher from '../src/Matcher';
import {
  accumulateRoutes,
  checkResolved,
  getComponents,
  getRouteMatches,
  getRouteValues,
  isResolved,
} from '../src/ResolverUtils';

describe('ResolverUtils', () => {
  let match;

  const Foo = () => null;
  const Bar = () => null;

  beforeEach(() => {
    const matcher = new Matcher([
      {
        path: 'foo',
        Component: Foo,
        value: 9,
        children: [
          {
            path: 'bar',
            getComponent: () => Bar,
            getValue: ({ params }) => params.quux,
            children: {
              nav: [{ path: '(.*)?' }],
              main: [{ path: 'baz' }, { path: 'qux/:quux' }],
            },
          },
        ],
      },
    ]);

    match = matcher.match({ pathname: '/foo/bar/qux/a' });
    match.routes = matcher.getRoutes(match);
  });

  describe('checkResolved, isResolved', () => {
    it('should return true for non-promises', async () => {
      expect(isResolved(await checkResolved({}))).toBe(true);
    });

    it('should return true for resolved promises', async () => {
      expect(isResolved(await checkResolved(Promise.resolve({})))).toBe(true);

      expect(
        isResolved(
          await checkResolved(Promise.resolve({}).then(value => value)),
        ),
      ).toBe(true);
    });

    it('should return false for unresolved promises', async () => {
      expect(
        isResolved(
          await checkResolved(
            // FIXME: This is not quite the right condition, but the test is
            // flaky on Travis with a 0-delay timeout.
            new Promise(resolve => {
              setTimeout(resolve, 10);
            }),
          ),
        ),
      ).toBe(false);

      expect(isResolved(await checkResolved(new Promise(() => {})))).toBe(
        false,
      );
    });
  });

  describe('getRouteMatches', () => {
    it('should get per-route match information', () => {
      expect(getRouteMatches(match)).toMatchObject([
        { route: { path: 'foo' }, params: { quux: 'a' } },
        { route: { path: 'bar' }, params: { quux: 'a' } },
        { route: { path: '(.*)?' }, params: { quux: 'a' } },
        { route: { path: 'qux/:quux' }, params: { quux: 'a' } },
      ]);
    });
  });

  describe('getRouteValues', () => {
    it('should get static and computed route values', () => {
      expect(
        getRouteValues(
          getRouteMatches(match),
          route => route.getValue,
          route => route.value,
        ),
      ).toEqual([9, 'a', undefined, undefined]);
    });
  });

  describe('getComponents', () => {
    it('should get static and computed route components', () => {
      expect(getComponents(getRouteMatches(match))).toEqual([
        Foo,
        Bar,
        undefined,
        undefined,
      ]);
    });
  });

  describe('accumulateRoutes', () => {
    it('should accumulate route trees', () => {
      expect(
        accumulateRoutes(
          getRouteMatches(match),
          (value, { path }) => `${value}/${path}`,
          '',
        ),
      ).toEqual(['/foo', '/foo/bar', '/foo/bar/(.*)?', '/foo/bar/qux/:quux']);
    });

    it('should handle empty matches', () => {
      expect(
        accumulateRoutes(
          getRouteMatches(match),
          (value, { path }) => `${value}/${path}`,
          '',
        ),
      ).toEqual(['/foo', '/foo/bar', '/foo/bar/(.*)?', '/foo/bar/qux/:quux']);
    });
  });
});
