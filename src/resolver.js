import isPromise from 'is-promise';

import createElements from './createElements';
import {
  checkResolved,
  getComponents,
  getRouteMatches,
  getRouteValues,
  isResolved,
} from './ResolverUtils';

export default {
  async *resolveElements(match) {
    const routeMatches = getRouteMatches(match);

    const Components = getComponents(routeMatches);
    const data = getRouteValues(
      routeMatches,
      route => route.getData,
      route => route.data,
    );

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
};
