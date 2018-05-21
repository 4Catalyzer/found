import isPromise from 'is-promise';
import warning from 'warning';

const UNRESOLVED = {};

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

export function getRouteMatches(match) {
  return match.routes.map((route, i) => ({
    ...match,
    route,
    routeParams: match.routeParams[i],
  }));
}

// Generates route data according to their getters and respects the order
// of the promises by the `defer` flag
export function getRouteData(routeMatches, getGetter, getValue) {
  return accumulateRouteValues(
    routeMatches,
    routeMatches[0].routeIndices,
    (value, match) => {
      const { route } = match;

      const getter = getGetter(route);

      const { lastDeferredPromise, lastPromise } = value;

      if (getter) {
        // If the route is deferred, execute the callback after the previous promise
        // Otherwise execute after the last deferred promise
        const promise = route.defer ? lastPromise : lastDeferredPromise;

        // If there is no promise to defer from, execute immediately
        const result = promise
          ? promise.then(() => getter.call(route, match))
          : getter.call(route, match);

        // Check if getter has returned a promise
        const valuePromise = isPromise(result) ? result : null;

        return {
          lastPromise: valuePromise,
          result,
          lastDeferredPromise: route.defer
            ? valuePromise
            : lastDeferredPromise,
        };
      }

      return {
        result: getValue(route),
        lastDeferredPromise,
        lastPromise,
      };
    },
    {
      result: null,
      lastPromise: null,
      lastDeferredPromise: null,
    },
  ).map(value => value.result);
}

// This should work better with Flow than the obvious solution with keys.
export function getRouteValues(routeMatches, getGetter, getValue) {
  return routeMatches.map(match => {
    const { route } = match;
    const getter = getGetter(route);
    return getter ? getter.call(route, match) : getValue(route);
  });
}

// This should be common to most resolvers, so make it available here.
export function getComponents(routeMatches) {
  return getRouteData(
    routeMatches,
    route => route.getComponent,
    route => {
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
    },
  );
}
