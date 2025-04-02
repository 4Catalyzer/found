import React from 'react';
import warning from 'tiny-warning';

import { isResolved } from './ResolverUtils';
import {
  type Match,
  type ResolvedElement,
  type RouteMatch,
} from './typeUtils';

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
export default function createElements(
  routeMatches: Array<RouteMatch>,
  Components: React.ComponentType<any>[],
  matchData: any,
): Array<ResolvedElement | undefined> {
  return routeMatches.map((match, i) => {
    const { router, route } = match;

    const Component: React.ComponentType<any> = Components[i];
    const data: any = matchData[i];

    const isComponentResolved = isResolved(Component);
    const areDataResolved = isResolved(data);

    // TODO: seems like `route` can either be RouteObject or an array of RouteObjects. Were previous types wrong?
    if (!Array.isArray(route) && route.render) {
      // Perhaps undefined here would be more correct for "not ready", but
      // Relay uses null in RelayReadyStateRenderer, so let's follow that
      // convention.
      return route.render({
        match: match as unknown as Match,
        Component: isComponentResolved ? Component : null,
        // TODO: Can `match` be removed?
        props: areDataResolved ? ({ match, router, data } as any) : null,
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
        `Route ${i} with data has no render method or component.`,
      );

      // Nothing to render.
      return null;
    }

    // eslint-disable-next-line react/jsx-key
    return <Component match={match} router={router} data={data} />;
  });
}
