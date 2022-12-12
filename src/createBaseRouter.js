import { dequal } from 'dequal';
import React from 'react';
import warning from 'tiny-warning';

import ActionTypes from './ActionTypes';
import RouterContext from './RouterContext';
import StaticContainer from './StaticContainer';
import createRender from './createRender';
import createStoreRouterObject from './createStoreRouterObject';
import resolveRenderArgs from './resolveRenderArgs';

/**
 * // Return annotation needed for TS to compile
 * @returns {any}
 */
export default function createBaseRouter({
  renderPending,
  renderReady,
  renderError,
  /**
   * The Router level render, is responsible for turning an array of route elements
   * into a single composed element that can be rendered by React.
   *
   * Turning:
   *
   * ```jsx
   * [<AppPage>, null, <ProductPage>, <ProductHistoryPage />]
   * ```
   * Into:
   *
   * ```jsx
   * <AppPage>
   *  <ProductPage>
   *    <ProductHistoryPage />
   *  </ProductPage>
   * </AppPage>
   * ```
   */
  render = createRender({
    renderPending,
    renderReady,
    renderError,
  }),
}) {
  class BaseRouter extends React.Component {
    constructor(props) {
      super(props);

      const { store, match, matchContext, resolver, initialRenderArgs } =
        props;

      this.router = createStoreRouterObject(store);

      this.state = {
        isInitialRender: true,
        match,
        matchContext,
        resolver,
        iteration: 0,
        routerContext: {
          router: this.router,
          match: initialRenderArgs || null,
        },
        element: initialRenderArgs ? render(initialRenderArgs) : null,
      };

      this.lastIteration = 0;
      this.pendingResolvedMatch = false;

      this.dispatchMatch = (pendingMatch) => {
        store.dispatch({
          type: ActionTypes.RESOLVE_MATCH,
          payload: pendingMatch,
        });
      };
    }

    // We use componentDidMount and componentDidUpdate to resolve the match if
    //  needed because element resolution is asynchronous anyway, and this lets
    //  us not worry about setState not being available in the constructor, or
    //  about having to pass around nextProps.

    componentDidMount() {
      this.mounted = true;
      if (!this.props.initialRenderArgs) {
        this.resolveMatch();
      }

      if (__DEV__ && typeof window !== 'undefined') {
        /* eslint-env browser */
        /* eslint-disable no-underscore-dangle */
        if (window.__FOUND_HOT_RELOAD__) {
          warning(
            !window.__FOUND_REPLACE_ROUTE_CONFIG__,
            'Replacing existing hot reloading hook. Do not render more than one router instance when using hot reloading.',
          );

          window.__FOUND_REPLACE_ROUTE_CONFIG__ =
            this.router.replaceRouteConfig;
        }
        /* eslint-enable no-underscore-dangle */
        /* eslint-env browser: false */
      }
    }

    static getDerivedStateFromProps({ match, resolver, matchContext }, state) {
      if (state.isInitialRender) {
        return { isInitialRender: false };
      }

      if (
        match !== state.match ||
        resolver !== state.resolver ||
        !dequal(matchContext, state.matchContext)
      ) {
        return {
          match,
          resolver,
          matchContext,
          iteration: state.iteration + 1,
        };
      }

      return null;
    }

    componentDidUpdate() {
      if (this.state.iteration > this.lastIteration) {
        this.lastIteration = this.state.iteration;
        this.resolveMatch();
      }
    }

    componentWillUnmount() {
      this.mounted = false;

      if (__DEV__ && typeof window !== 'undefined') {
        /* eslint-env browser */
        /* eslint-disable no-underscore-dangle */
        if (window.__FOUND_HOT_RELOAD__) {
          delete window.__FOUND_REPLACE_ROUTE_CONFIG__;
        }
        /* eslint-enable no-underscore-dangle */
        /* eslint-env browser: false */
      }
    }

    async resolveMatch() {
      const pendingIteration = this.lastIteration;
      const pendingMatch = this.props.match;

      try {
        for await (const renderArgs of resolveRenderArgs(
          this.router,
          this.props,
        )) {
          // Don't do anything if we're resolving an outdated match.
          if (!this.mounted || this.lastIteration !== pendingIteration) {
            return;
          }

          // If we're about to mark the match resolved, delay the rerender
          //  until we do so.
          this.pendingResolvedMatch = !!(
            (renderArgs.elements || renderArgs.error) &&
            this.props.resolvedMatch !== pendingMatch
          );

          this.setState({
            routerContext: {
              router: this.router,
              match: renderArgs,
            },
            element: render(renderArgs),
          });

          if (this.pendingResolvedMatch) {
            // If this is a new match, update the store, so we can rerender at
            //  the same time as all of the links and other components
            //  connected to the router state.
            this.pendingResolvedMatch = false;
            this.dispatchMatch(pendingMatch);
          }
        }
      } catch (e) {
        if (!this.mounted || this.lastIteration !== pendingIteration) {
          return;
        }

        if (e.isFoundRedirectException) {
          this.router.replace(e.location);
          return;
        }

        /* istanbul ignore next: paranoid guard */
        throw e;
      }
    }

    render() {
      const { iteration, routerContext, element } = this.state;

      // Don't rerender synchronously if we have another rerender coming.
      return (
        <StaticContainer
          shouldUpdate={
            this.lastIteration === iteration && !this.pendingResolvedMatch
          }
        >
          <RouterContext.Provider value={routerContext}>
            {element}
          </RouterContext.Provider>
        </StaticContainer>
      );
    }
  }

  return BaseRouter;
}
