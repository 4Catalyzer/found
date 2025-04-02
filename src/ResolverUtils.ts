import isPromise from 'is-promise';
import { setImmediate } from 'tiny-set-immediate';
import warning from 'tiny-warning';

import {
  type Match,
  type RouteIndices,
  type RouteMatch,
  type RouteObjectBase,
} from './typeUtils';

const UNRESOLVED = {};

/**
 * Detects a resolved Promise by racing a sentinel value with the promise.
 * If the sentinel returns first the promise is still pending.
 *
 * If the value is not a promise it's simply returned
 */
export function checkResolved<T extends Promise<T>>(value: T): Promise<T> | T {
  if (!isPromise(value)) {
    return value;
  }
  const ret = Promise.race<T>([
    value,
    new Promise((resolve) => {
      setImmediate(resolve, UNRESOLVED);
    }),
  ]);

  return ret;
}

export function isResolved<T>(value: T | Record<string, unknown>): value is T {
  return value !== UNRESOLVED;
}

function accumulateRouteValuesImpl(
  routeValues: RouteMatch[],
  routeIndices: RouteIndices,
  callback: (...args: any[]) => Record<string, unknown>,
  initialValue: Record<string, unknown>,
) {
  const accumulated = [];
  let value = initialValue;

  for (const routeIndex of routeIndices) {
    if (typeof routeIndex === 'object') {
      Object.values(routeIndex).forEach((groupRouteIndices) => {
        accumulated.push(
          ...accumulateRouteValuesImpl(
            routeValues,
            groupRouteIndices,
            callback,
            value,
          ),
        );
      });
    } else {
      value = callback(value, routeValues.shift());
      accumulated.push(value);
    }
  }

  return accumulated;
}

export function accumulateRouteValues(
  routeValues: RouteMatch[],
  routeIndices: RouteIndices,
  // TODO: type this better
  callback: (...args: any[]) => Record<string, unknown>,
  initialValue: Record<string, unknown>,
) {
  return accumulateRouteValuesImpl(
    [...routeValues],
    routeIndices,
    callback,
    initialValue,
  );
}

export function getRouteMatches(match: Match) {
  return match.routes.map((route, i) => ({
    ...match,
    route,
    routeParams: match.routeParams[i],
  }));
}

export function getRouteValue(
  match: RouteMatch,
  getGetter: (route: RouteObjectBase) => RouteObjectBase['getData'],
  getValue: (route: RouteObjectBase) => RouteObjectBase['data'],
) {
  const { route } = match;
  const getter = getGetter(route);
  return getter ? getter.call(route, match) : getValue(route);
}

// This is a little more versatile than if we only passed in keys.
export function getRouteValues(
  routeMatches: RouteMatch[],
  getGetter: (route: RouteObjectBase) => RouteObjectBase['getData'],
  getValue: (route: RouteObjectBase) => RouteObjectBase['data'],
) {
  return routeMatches.map((match) =>
    getRouteValue(match, getGetter, getValue),
  );
}

function getRouteGetComponent(route: RouteObjectBase) {
  return route.getComponent;
}

function getRouteComponent(route: RouteObjectBase) {
  if (__DEV__ && route.component) {
    warning(
      route.Component,
      `Route with \`component\` property \`${
        route.component.displayName || route.component.name
      }\` has no \`Component\` property. The expected property for the route component is \`Component\`.`,
    );
  }

  return route.Component;
}

// This should be common to most resolvers, so make it available here.
export function getComponents(routeMatches: RouteMatch[]) {
  return getRouteValues(routeMatches, getRouteGetComponent, getRouteComponent);
}
