import { checkResolved, isResolved } from '../src/ResolverUtils';

describe('ResolverUtils', () => {
  describe('checkResolved, isResolved', () => {
    it('should return true for non-promises', async () => {
      expect(isResolved(
        await checkResolved({}),
      )).toBe(true);
    });

    it('should return true for resolved promises', async () => {
      expect(isResolved(
        await checkResolved(Promise.resolve({})),
      )).toBe(true);

      expect(isResolved(
        await checkResolved(Promise.resolve({}).then(value => value)),
      )).toBe(true);
    });

    it('should return false for unresolved promises', async () => {
      expect(isResolved(
        await checkResolved(new Promise(setTimeout)),
      )).toBe(false);

      expect(isResolved(
        await checkResolved(new Promise(() => {})),
      )).toBe(false);
    });
  });

  describe.skip('getRouteMatches', () => {
    it('untested');
  });

  describe.skip('getRouteValues', () => {
    it('untested');
  });

  describe.skip('getComponents', () => {
    it('untested');
  });
});
