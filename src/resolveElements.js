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

  const Components = routes.map(route => (
    route.getComponent ? route.getComponent(match) : route.Component
  ));
  const data = routes.map(route => (
    route.getData ? route.getData(match) : route.data
  ));

  if (!Components.some(isPromise) && !data.some(isPromise)) {
    yield createElements(match, Components, data);
    return;
  }

  const earlyComponents = await Promise.all(Components.map(checkResolved));
  const earlyData = await Promise.all(data.map(checkResolved));

  const earlyElements = createElements(match, earlyComponents, earlyData);
  yield earlyElements.every(element => element !== undefined) ?
    earlyElements : undefined;

  if (earlyComponents.every(isResolved) && earlyData.every(isResolved)) {
    // We're done if all promises were resolved.
    return;
  }

  const resolvedComponents = await Promise.all(Components);
  const resolvedData = await Promise.all(data);

  yield createElements(match, resolvedComponents, resolvedData);
}
