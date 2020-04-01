import HttpError from './HttpError';

function foldElements(elementsRaw, routeIndices) {
  const elements = [];

  for (const routeIndex of routeIndices) {
    if (typeof routeIndex === 'object') {
      // Reshape the next elements in the elements array to match the nested
      // tree structure corresponding to the route groups.
      const groupElements = {};
      Object.entries(routeIndex).forEach(([groupName, groupRouteIndices]) => {
        groupElements[groupName] = foldElements(
          elementsRaw,
          groupRouteIndices,
        );
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

export default async function* resolveRenderArgs(
  router,
  { match, matchContext, resolver },
) {
  const routes = router.matcher.getRoutes(match);

  const augmentedMatch = {
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
    for await (const elements of resolver.resolveElements(augmentedMatch)) {
      yield {
        ...augmentedMatch,
        elements: elements && foldElements([...elements], match.routeIndices),
      };
    }
  } catch (e) {
    if (e.isFoundHttpError) {
      yield { ...augmentedMatch, error: e };
      return;
    }

    throw e;
  }
}
