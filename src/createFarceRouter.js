import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect';
import FarceActions from 'farce/Actions';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import createBaseRouter from './createBaseRouter';
import createFarceStore from './createFarceStore';

export default function createFarceRouter({
  store: userStore,
  historyProtocol,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  getFound = ({ found }) => found,
  ...options
}) {
  const Router = createBaseRouter(options);

  const store =
    userStore ||
    createFarceStore({
      historyProtocol,
      historyMiddlewares,
      historyOptions,
      routeConfig,
    });

  const FarceRouter = forwardRef((props, ref) => {
    const [state, setState] = useState(() => {
      const { match, resolvedMatch } = getFound(store.getState());
      return { match, resolvedMatch };
    });

    useIsomorphicEffect(() => {
      return store.subscribe(() => {
        setState((prev) => {
          const { match, resolvedMatch } = getFound(store.getState());
          if (prev?.match === match && prev.resolvedMatch === resolvedMatch) {
            return prev;
          }
          return { match, resolvedMatch };
        });
      });
    }, []);

    useEffect(() => {
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        store.dispatch(FarceActions.dispose());
      };
    }, []);

    useImperativeHandle(ref, () => store, []);

    return <Router {...props} {...state} store={store} />;
  });
  FarceRouter.displayName = 'FarceRouter';
  return FarceRouter;
}
