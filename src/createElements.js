import React from 'react';
import warning from 'warning';

import { isResolved } from './ResolverUtils';

export default function createElements(routeMatches, Components, matchData) {
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
        'Route %s with data has no render method or component.',
        i,
      );

      // Nothing to render.
      return null;
    }

    return <Component {...match} data={data} />;
  });
}
