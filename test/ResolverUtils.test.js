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
        await checkResolved(
          // FIXME: This is not quite the right condition, but the test is
          // flaky on Travis with a 0-delay timeout.
          new Promise((resolve) => { setTimeout(resolve, 10); }),
        ),
      )).toBe(false);

      expect(isResolved(
        await checkResolved(new Promise(() => {})),
      )).toBe(false);
    });
  });

  describe.skip('getRouteMatches', () => {
    test('untested');
  });

  describe.skip('getRouteValues', () => {
    test('untested');
  });

  describe.skip('getComponents', () => {
    test('untested');
  });
});
