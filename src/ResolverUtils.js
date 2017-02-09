// @flow
import isPromise from 'is-promise';

const UNRESOLVED = {};

export function checkResolved(value: any) {
  if (!isPromise(value)) {
    return value;
  }

  return Promise.race([
    value,
    new Promise((resolve) => { setImmediate(resolve, UNRESOLVED); }),
  ]);
}

export function isResolved(value: any) {
  return value !== UNRESOLVED;
}

export function getRouteMatches(match: any) {
  return match.routes.map((route, i) => ({
    ...match, route, routeParams: match.routeParams[i],
  }));
}

// This should work better with Flow than the obvious solution with keys.
export function getRouteValues(
  routeMatches: any,
  getGetter: any,
  getValue: any
) {
  return routeMatches.map((match) => {
    const { route } = match;
    const getter = getGetter(route);
    return getter ? getter.call(route, match) : getValue(route);
  });
}

export function getComponents(routeMatches: any) {
  return getRouteValues(
    routeMatches,
    route => route.getComponent,
    route => route.Component,
  );
}
