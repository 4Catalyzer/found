import HttpError from './HttpError';
import {
  Match,
  ResolvedElement,
  Resolver,
  RouteIndices,
  RouteObject,
  Router,
} from './typeUtils';

// This is the folded resolver output from resolveRenderArgs.
export type RenderArgsElements = Array<
  ResolvedElement | Record<string, ResolvedElement[]>
>;

function foldElements(
  elementsRaw: Array<ResolvedElement>,
  routeIndices: RouteIndices,
): RenderArgsElements {
  const elements = [];

  for (const routeIndex of routeIndices) {
    if (typeof routeIndex === 'object') {
      // Reshape the next elements in the elements array to match the nested
      // tree structure corresponding to the route groups.
      const groupElements: any = {};
      Object.entries(routeIndex).forEach(([groupName, groupRouteIndices]) => {
        const folded = foldElements(elementsRaw, groupRouteIndices);
        groupElements[groupName] = folded;
      });

      elements.push(groupElements);
    } else {
      // We intentionally modify elementsRaw, to make it easier to recursively
      // handle groups.
      elements.push(elementsRaw.shift());
    }
  }

  return elements;
}

interface AugmentedMatchType extends Match {
  routes: RouteObject[];
  router: Router;
  context: any;
}

export interface ResolveRender extends AugmentedMatchType {
  error?: any;
  elements?: RenderArgsElements;
}

export default async function* resolveRenderArgs(
  router: Router,
  {
    match,
    matchContext,
    resolver,
  }: { match: Match; matchContext: any; resolver: Resolver },
): AsyncGenerator<ResolveRender, undefined> {
  const routes = router.matcher.getRoutes(match)!;

  const augmentedMatch: AugmentedMatchType = {
    ...match,
    routes,
    router, // Convenience access for route components.
    context: matchContext,
  };

  if (!routes) {
    // Immediately render a "not found" error if no routes matched.
    yield { ...augmentedMatch, error: new HttpError(404) };
    return;
  }

  try {
    for await (const elements of resolver.resolveElements(augmentedMatch)!) {
      yield {
        ...augmentedMatch,
        elements: elements && foldElements([...elements], match.routeIndices),
      };
    }
  } catch (e: any) {
    if (e.isFoundHttpError) {
      yield { ...augmentedMatch, error: e };
      return;
    }

    throw e;
  }
}
