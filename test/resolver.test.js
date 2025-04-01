import delay from 'delay';
import pDefer from 'p-defer';
import { describe, expect, it, vi } from 'vitest';

import { getRouteMatches } from '../src/ResolverUtils';
import resolver from '../src/resolver';

describe('resolver', () => {
  describe('getData', () => {
    it('should support defer', async () => {
      const deferred1 = pDefer();
      const deferred2 = pDefer();
      const deferred3 = pDefer();

      const getData1 = vi.fn(() => deferred1.promise);
      const getData3 = vi.fn(() => deferred3.promise);
      const getData4 = vi.fn(() => 4);

      const match = {
        routes: [
          {
            getData: getData1,
            render: () => null,
          },
          {
            data: deferred2.promise,
            render: () => null,
          },
          {
            getData: getData3,
            defer: true,
            render: () => null,
          },
          {
            getData: getData4,
            render: () => null,
          },
        ],
        routeParams: [{}, {}, {}, {}],
        routeIndices: [0, 0, 0, 0],
      };

      const routeMatches = getRouteMatches(match);
      const dataPromises = resolver.getData(match, routeMatches);

      expect(getData1).toHaveBeenCalled();
      expect(getData3).not.toHaveBeenCalled();
      expect(getData4).not.toHaveBeenCalled();

      deferred2.resolve(2);
      await delay(10);

      expect(getData3).not.toHaveBeenCalled();
      expect(getData4).not.toHaveBeenCalled();

      deferred1.resolve(1);
      await delay(10);

      expect(getData3).toHaveBeenCalled();
      expect(getData4).toHaveBeenCalled();

      deferred3.resolve(3);

      const data = await Promise.all(dataPromises);
      expect(data).toEqual([1, 2, 3, 4]);
    });
  });
});
