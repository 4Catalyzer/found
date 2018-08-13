import isPromise from 'is-promise';
import warning from 'warning';

const UNRESOLVED = {};

export function checkResolved(value) {
  if (!isPromise(value)) {
    return value;
  }

  return Promise.race([
    value,
    new Promise(resolve => {
      setImmediate(resolve, UNRESOLVED);
    }),
  ]);
}

export function isResolved(value) {
  return value !== UNRESOLVED;
}

function accumulateRouteValuesImpl(
  routeValues,
  routeIndices,
  callback,
  initialValue,
) {
  const accumulated = [];
  let value = initialValue;

  for (const routeIndex of routeIndices) {
    if (typeof routeIndex === 'object') {
      // eslint-disable-next-line no-loop-func
      Object.values(routeIndex).forEach(groupRouteIndices => {
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
  routeValues,
  routeIndices,
  callback,
  initialValue,
) {
  return accumulateRouteValuesImpl(
    [...routeValues],
    routeIndices,
    callback,
    initialValue,
  );
}

export function getRouteMatches(match) {
  return match.routes.map((route, i) => ({
    ...match,
    route,
    routeParams: match.routeParams[i],
  }));
}

function getRouteValue(match, getGetter, getValue) {
  const { route } = match;
  const getter = getGetter(route);
  return getter ? getter.call(route, match) : getValue(route);
}

// This is a little more versatile than if we only passed in keys.
export function getRouteValues(routeMatches, getGetter, getValue) {
  return routeMatches.map(match => getRouteValue(match, getGetter, getValue));
}

function getGetComponent(route) {
  return route.getComponent;
}

function getComponent(route) {
  if (__DEV__ && route.component) {
    warning(
      route.Component,
      'Route with `component` property `%s` has no `Component` ' +
        'property. The expected property for the route component ' +
        'is `Component`.',
      route.component.displayName || route.component.name,
    );
  }

  return route.Component;
}

// This should be common to most resolvers, so make it available here.
export function getComponents(routeMatches) {
  return getRouteValues(routeMatches, getGetComponent, getComponent);
}

function getGetData(route) {
  return route.getData;
}

function getData(route) {
  return route.data;
}

/**
 * Generate route data according to their getters, respecting the order of
 * promises per the `defer` flag on routes.
 */
export function getRouteData(routeMatches) {
  return accumulateRouteValues(
    routeMatches,
    routeMatches[0].routeIndices,
    ({ prevParentPromise, prevPromise }, match) => {
      const { defer } = match.route;

      // For a deferred route, the parent promise is the previous promise.
      // Otherwise, it's the previous parent promise.
      const parentPromise = defer ? prevPromise : prevParentPromise;

      // If there is a parent promise, execute after it resolves.
      const routeData = parentPromise
        ? parentPromise.then(() => getRouteValue(match, getGetData, getData))
        : getRouteValue(match, getGetData, getData);

      return {
        routeData,
        prevPromise: isPromise(routeData) ? routeData : prevPromise,
        prevParentPromise: parentPromise,
      };
    },
    {
      routeData: null,
      prevPromise: null,
      prevParentPromise: null,
    },
  ).map(({ routeData }) => routeData);
}
