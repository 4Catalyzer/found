import isPromise from 'is-promise';

import createElements from './createElements';
import {
  checkResolved,
  getComponents,
  getRouteMatches,
  getRouteValue,
  isResolved,
  accumulateRouteValues,
} from './ResolverUtils';

function getRouteGetData(route) {
  return route.getData;
}

function getRouteData(route) {
  return route.data;
}

export default {
  async *resolveElements(match) {
    const routeMatches = getRouteMatches(match);

    const Components = getComponents(routeMatches);
    const data = this.getData(match, routeMatches);

    const earlyComponents = Components.some(isPromise)
      ? await Promise.all(Components.map(checkResolved))
      : Components;
    const earlyData = data.some(isPromise)
      ? await Promise.all(data.map(checkResolved))
      : data;

    let fetchedComponents;
    let fetchedData;

    if (!earlyComponents.every(isResolved) || !earlyData.every(isResolved)) {
      const pendingElements = createElements(
        routeMatches,
        earlyComponents,
        earlyData,
      );

      yield pendingElements.every(element => element !== undefined)
        ? pendingElements
        : undefined;

      fetchedComponents = await Promise.all(Components);
      fetchedData = await Promise.all(data);
    } else {
      fetchedComponents = earlyComponents;
      fetchedData = earlyData;
    }

    yield createElements(routeMatches, fetchedComponents, fetchedData);
  },

  /**
   * Generate route data according to their getters, respecting the order of
   * promises per the `defer` flag on routes.
   */
  getData(match, routeMatches) {
    return accumulateRouteValues(
      routeMatches,
      match.routeIndices,
      ({ ancestorRouteData, prevParentPromise }, routeMatch) => {
        // For a deferred route, the parent promise is the previous promise.
        // Otherwise, it's the previous parent promise.
        const parentPromise = routeMatch.route.defer
          ? Promise.all(ancestorRouteData)
          : prevParentPromise;

        // If there is a parent promise, execute after it resolves.
        const routeData = parentPromise
          ? parentPromise.then(() =>
              getRouteValue(routeMatch, getRouteGetData, getRouteData),
            )
          : getRouteValue(routeMatch, getRouteGetData, getRouteData);

        return {
          routeData,
          ancestorRouteData: [...ancestorRouteData, routeData],
          prevParentPromise: parentPromise,
        };
      },
      {
        routeData: null,
        ancestorRouteData: [],
        prevParentPromise: null,
      },
    ).map(({ routeData }) => routeData);
  },
};
