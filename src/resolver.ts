import isPromise from 'is-promise';

import {
  accumulateRouteValues,
  checkResolved,
  getComponents,
  getDatum,
  getRouteMatches,
  isResolved,
  Unresolved,
} from './ResolverUtils';
import createElements from './createElements';
import {
  type Match,
  type ResolvedElement,
  type RouteMatch,
} from './typeUtils';

type RouteComponent = React.ComponentType<any> | undefined;
type ResolvedComponent = RouteComponent | Unresolved;

export default {
  /**
   * `resolveElements` is responsible for converting a `match` into an
   * array of React `element`s. Rather than just returning an array,
   * it models all element/state updates for a match as an async iterable.
   *
   * This iterable will usually produce 2 values. The first being the "pending"
   * or loading states of the match. and the second being the final resolved set with data
   * and components being loaded fully. This second value is the "done" state for a match.
   *
   * If a match doesn't produce an element for every route, it yields `undefined` which
   * is interpreted by the `Router` as "continue to render the last UI while waiting
   * for the resolver to produce the final value", via a `StaticContainer`. This
   * is the default "loading" behavior and can be overridden by having `route.render`
   * produce any value but `undefined`.
   *
   * Generally though, routes will implement `render` which can implement a number of loading
   * strategies, either showing a spinner or skeleton UI while it waits for data to load.
   *
   * The iterable will produce only 1 value, if there is no async work to be done for the match.
   */
  async *resolveElements(
    match: Match,
  ): AsyncGenerator<Array<ResolvedElement> | undefined> {
    const routeMatches = getRouteMatches(match);

    const Components = getComponents(routeMatches);
    const data = this.getData(match, routeMatches);

    const earlyComponents: ResolvedComponent[] = Components.some(isPromise)
      ? await Promise.all(Components.map((c) => checkResolved(c)))
      : (Components as RouteComponent[]);

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

      yield pendingElements.every((element) => element !== undefined)
        ? (pendingElements as ResolvedElement[])
        : undefined;

      fetchedComponents = await Promise.all(Components);
      fetchedData = await Promise.all(data);
    } else {
      fetchedComponents = earlyComponents;
      fetchedData = earlyData;
    }

    yield createElements(
      routeMatches,
      fetchedComponents,
      fetchedData,
    ) as ResolvedElement[];
  },

  /**
   * Generate route data according to their getters, respecting the order of
   * promises per the `defer` flag on routes.
   *
   */
  // TODO: should this even be exported?
  getData(match: Match, routeMatches: Array<RouteMatch>) {
    type RouteDataAccumulator = {
      routeData: unknown | Promise<unknown>;
      ancestorRouteData: unknown[];
      prevParentPromise: unknown | null;
    };

    return accumulateRouteValues<RouteDataAccumulator>(
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
          ? parentPromise.then(() => getDatum(routeMatch))
          : getDatum(routeMatch);

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
