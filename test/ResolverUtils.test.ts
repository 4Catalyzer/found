import delay from 'delay';

import Matcher from '../src/Matcher';
import {
  accumulateRouteValues,
  checkResolved,
  getComponents,
  getRouteMatches,
  getRouteValues,
  isResolved,
} from '../src/ResolverUtils';
import { noop } from './helpers';

const createPromise = <T>(returnVal: T): Promise<T> =>
  new Promise((resolve) => resolve(returnVal));

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
      expect(isResolved(await checkResolved(await createPromise({})))).toBe(
        true,
      );

      expect(
        isResolved(
          await checkResolved(Promise.resolve({}).then((value) => value)),
        ),
      ).toBe(true);
    });

    it('should return false for unresolved promises', async () => {
      expect(
        isResolved(
          await checkResolved(
            // FIXME: This is not quite the right condition, but the test is
            // flaky on Travis with a 0-delay timeout.
            delay(10),
          ),
        ),
      ).toBe(false);

      expect(isResolved(await checkResolved(new Promise(noop)))).toBe(false);
    });
  });

  describe('accumulateRouteValues', () => {
    it('should accumulate route values along match tree', () => {
      expect(
        accumulateRouteValues(
          getRouteMatches(match),
          match.routeIndices,
          (value, { route: { path } }) => `${value}/${path}`,
          '',
        ),
      ).toEqual(['/foo', '/foo/bar', '/foo/bar/(.*)?', '/foo/bar/qux/:quux']);
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
          (route) => route.getValue,
          (route) => route.value,
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
});
