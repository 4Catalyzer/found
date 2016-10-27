import isPromise from 'is-promise';
import React from 'react';
import warning from 'warning';

import { checkResolved, isResolved } from './PromiseUtils';

function createElements(match, Components, matchData) {
  const { routes, routeParams: matchRouteParams } = match;

  return routes.map((route, i) => {
    const Component = Components[i];
    const data = matchData[i];
    const routeParams = matchRouteParams[i];

    const isComponentResolved = isResolved(Component);
    const isDataResolved = isResolved(data);

    const routeMatch = {
      ...match,
      route,
      routeParams: routeParams[i],
    };

    if (route.render) {
      // Perhaps undefined here would be more correct for "not ready", but
      // Relay uses null in RelayReadyStateRenderer, so let's follow that
      // convention.
      return route.render({
        Component: isComponentResolved ? Component : null,
        props: isDataResolved ? { ...routeMatch, data } : null,
        match: routeMatch,
        data: isDataResolved ? data : null,
      });
    }

    if (!isComponentResolved || !isDataResolved) {
      // Can't render.
      return undefined;
    }

    if (!Component) {
      warning(
        data === undefined,
        `Route ${i} has data, but no render method or component.`,
      );

      // Nothing to render.
      return null;
    }

    return (
      <Component
        {...routeMatch}
        data={data}
      />
    );
  });
}

export default async function* resolveElements(match) {
  const { routes } = match;

  // TODO: These should use routeMatch objects as above.
  const Components = routes.map(route => (
    route.getComponent ? route.getComponent(match) : route.Component
  ));
  const data = routes.map(route => (
    route.getData ? route.getData(match) : route.data
  ));

  const earlyComponents = Components.some(isPromise) ?
    await Promise.all(Components.map(checkResolved)) : Components;
  const earlyData = data.some(isPromise) ?
    await Promise.all(data.map(checkResolved)) : data;

  let resolvedComponents;
  let resolvedData;

  if (!earlyComponents.every(isResolved) || !earlyData.every(isResolved)) {
    const pendingElements = createElements(match, earlyComponents, earlyData);
    yield pendingElements.every(element => element !== undefined) ?
      pendingElements : undefined;

    resolvedComponents = await Promise.all(Components);
    resolvedData = await Promise.all(data);
  } else {
    resolvedComponents = earlyComponents;
    resolvedData = earlyData;
  }

  yield createElements(match, resolvedComponents, resolvedData);
}
