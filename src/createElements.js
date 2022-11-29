import React from 'react';
import warning from 'tiny-warning';

import { isResolved } from './ResolverUtils';

/**
 * maps an array of `Route`s to React elements. The returned array
 * may contain elements, `null`, or `undefined`. The nullish values produce different results!
 * `undefined` means "still resolving", whereas `null` means "nothing to render". This
 * is important because the resolver calling this, will not update the existing UI
 * if there is an `undefined` value, whereas it will update `null`s rendering nothing.
 *
 * @param {*} routeMatches An array of matched routes
 * @param {*} Components An array of possibly resolved route Components
 * @param {*} matchData An array of possibly resolved route data
 * @returns [null | ReactElement | undefined]
 */
export default function createElements(routeMatches, Components, matchData) {
  return routeMatches.map((match, i) => {
    const { router, route } = match;

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
        props: areDataResolved ? { match, router, data } : null,
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

    return <Component match={match} router={router} data={data} />;
  });
}
