import mapContextToProps from '@restart/context/mapContextToProps';
import { dequal } from 'dequal';
import PropTypes from 'prop-types';
import React from 'react';
import { ReactReduxContext } from 'react-redux';
import warning from 'tiny-warning';

import RouterContext from './RouterContext';
import StaticContainer from './StaticContainer';
import createRender from './createRender';
import createStoreRouterObject from './createStoreRouterObject';
import resolveRenderArgs from './resolveRenderArgs';

export default function createBaseRouter({
  renderPending,
  renderReady,
  renderError,
  render = createRender({
    renderPending,
    renderReady,
    renderError,
  }),
}) {
  const propTypes = {
    store: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resolvedMatch: PropTypes.object.isRequired,
    matchContext: PropTypes.any,
    resolver: PropTypes.shape({
      resolveElements: PropTypes.func.isRequired,
    }).isRequired,
    onResolveMatch: PropTypes.func.isRequired,
    initialRenderArgs: PropTypes.object,
  };

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

      this.mounted = true;

      this.lastIteration = 0;
      this.pendingResolvedMatch = false;
    }

    // We use componentDidMount and componentDidUpdate to resolve the match if
    //  needed because element resolution is asynchronous anyway, and this lets
    //  us not worry about setState not being available in the constructor, or
    //  about having to pass around nextProps.

    componentDidMount() {
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
            this.props.onResolveMatch(pendingMatch);
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

  BaseRouter.propTypes = propTypes;

  // FIXME: For some reason, using contextType doesn't work here.
  return mapContextToProps(
    {
      consumers: ReactReduxContext,
      mapToProps: ({ store }) => ({ store }),
      displayName: 'withStore(BaseRouter)',
    },
    BaseRouter,
  );
}
