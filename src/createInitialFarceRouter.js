import createFarceRouter from './createFarceRouter';
import getStoreRenderArgs from './getStoreRenderArgs';
import createFarceStore from './utils/createFarceStore';

export default async function createInitialFarceRouter({
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  matchContext,
  resolveElements,
  ...options
}) {
  const store = createFarceStore({
    historyProtocol,
    historyMiddlewares,
    historyOptions,
    routeConfig,
  });

  const FarceRouter = createFarceRouter({ ...options, store });

  // This intentionally doesn't handle RedirectExceptions, because those
  // shouldn't happen here anyway.
  const initialRenderArgs = await getStoreRenderArgs({
    store,
    matchContext,
    resolveElements,
  });

  // We own this FarceRouter, so it's safe to replace its default props.
  FarceRouter.defaultProps = {
    ...FarceRouter.defaultProps,
    matchContext,
    resolveElements,
    initialRenderArgs,
  };

  return FarceRouter;
}
