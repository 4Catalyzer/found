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

export function getRouteMatches(match) {
  return match.routes.map((route, i) => ({
    ...match,
    route,
    routeParams: match.routeParams[i],
  }));
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
  return getRouteValues(
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

function accumulateRoutesImpl(
  routeMatches,
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
          ...accumulateRoutesImpl(
            routeMatches,
            groupRouteIndices,
            callback,
            value,
          ),
        );
      });
    } else {
      value = callback(value, routeMatches.shift().route);
      accumulated.push(value);
    }
  }

  return accumulated;
}

export function accumulateRoutes(routeMatches, callback, initialValue) {
  // Route match arrays are always non-empty. An empty match makes no sense.
  const { routeIndices } = routeMatches[0];

  return accumulateRoutesImpl(
    [...routeMatches],
    routeIndices,
    callback,
    initialValue,
  );
}
