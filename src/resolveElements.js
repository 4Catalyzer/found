import isPromise from 'is-promise';
import React from 'react';
import warning from 'warning';

import HttpError from './HttpError';

const UNRESOLVED = {};

function checkResolved(value) {
  if (!isPromise(value)) {
    return value;
  }

  return Promise.race([value, UNRESOLVED]);
}

function isResolved(value) {
  return value !== UNRESOLVED;
}

function createElements(match, Components, matchData) {
  const { routes, routeParams: matchRouteParams } = match;

  return routes.map((route, i) => {
    const Component = Components[i];
    const data = matchData[i];
    const routeParams = matchRouteParams[i];

    const routeMatch = {
      ...match,
      route,
      routeParams: routeParams[i],
    };

    if (route.render) {
      // Perhaps undefined here would be more correct for "not ready", but
      // Relay uses null in RelayReadyStateRenderer, so let's follow that
      // example.
      return route.render({
        Component: isResolved(Component) ? Component : null,
        props: isResolved(data) ? { ...routeMatch, data } : null,
        match: routeMatch,
      });
    }

    if (!isResolved(Component) || !isResolved(data)) {
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
  if (!routes) {
    throw new HttpError(404);
  }

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
