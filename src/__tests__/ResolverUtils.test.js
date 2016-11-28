import {
  checkResolved,
  isResolved,
} from '../ResolverUtils';


it('isResolve should return true when value is already resolved', async () => {
  expect(isResolved(
    await checkResolved({})
  )).toBe(true);
  expect(isResolved(
    await checkResolved(Promise.resolve({}))
  )).toBe(true);
  expect(isResolved(
    await checkResolved(new Promise(
      resolve => setTimeout(resolve, 0)
    ))
  )).toBe(false);
  expect(isResolved(
    await checkResolved(new Promise(() => {}))
  )).toBe(false);
});

xit('getRouteMatches should be tested', () => {
  // body...
});

xit('getRouteValues should be tested', () => {
  // body...
});

xit('getComponents should be tested', () => {
  // body...
});
