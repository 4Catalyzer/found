import HttpError from '../HttpError';

export default async function* resolveRenderArgs({
  router, match, matchContext, resolveElements,
}) {
  const routes = router.matcher.getRoutes(match);

  const augmentedMatch = {
    ...match,
    routes,
    match, // For symmetry with withRouter.
    router, // Convenience access for route components.
    context: matchContext,
  };

  if (!routes) {
    // Immediately render a "not found" error if no routes matched.
    yield { ...augmentedMatch, error: new HttpError(404) };
    return;
  }

  try {
    // ESLint doesn't handle for-await yet.
    // eslint-disable-next-line semi
    for await (const elements of resolveElements(augmentedMatch)) {
      yield { ...augmentedMatch, elements };
    }
  } catch (e) {
    if (e instanceof HttpError) {
      yield { ...augmentedMatch, error: e };
      return;
    }

    throw e;
  }
}
