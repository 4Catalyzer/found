import isPromise from 'is-promise';
import React from 'react';
import warning from 'warning';

import {
  checkResolved, getComponents, getRouteMatches, getRouteValues, isResolved,
} from './ResolverUtils';

function createElements(routeMatches, Components, matchData) {
  return routeMatches.map((match, i) => {
    const { route } = match;

    const Component = Components[i];
    const data = matchData[i];

    const isComponentResolved = isResolved(Component);
    const areDataResolved = isResolved(data);

    if (route.render) {
      // Perhaps undefined here would be more correct for "not ready", but
      // Relay uses null in RelayReadyStateRenderer, so let's follow that
      // convention.
      return route.render({
        match,
        Component: isComponentResolved ? Component : null,
        props: areDataResolved ? { ...match, data } : null,
        data: areDataResolved ? data : null,
      });
    }

    if (!isComponentResolved || !areDataResolved) {
      // Can't render.
      return undefined;
    }

    if (!Component) {
      // Note this check would be wrong on potentially unresolved data.
      warning(
        data === undefined,
        `Route ${i} has data, but no render method or component.`,
      );

      // Nothing to render.
      return null;
    }

    return <Component {...match} data={data} />;
  });
}

export default async function* resolveElements(match) {
  const routeMatches = getRouteMatches(match);

  const Components = getComponents(routeMatches);
  const data = getRouteValues(
    routeMatches,
    route => route.getData,
    route => route.data,
  );

  const earlyComponents = Components.some(isPromise) ?
    await Promise.all(Components.map(checkResolved)) : Components;
  const earlyData = data.some(isPromise) ?
    await Promise.all(data.map(checkResolved)) : data;

  let resolvedComponents;
  let resolvedData;

  if (!earlyComponents.every(isResolved) || !earlyData.every(isResolved)) {
    const pendingElements =
      createElements(routeMatches, earlyComponents, earlyData);
    yield pendingElements.every(element => element !== undefined) ?
      pendingElements : undefined;

    resolvedComponents = await Promise.all(Components);
    resolvedData = await Promise.all(data);
  } else {
    resolvedComponents = earlyComponents;
    resolvedData = earlyData;
  }

  yield createElements(routeMatches, resolvedComponents, resolvedData);
}
