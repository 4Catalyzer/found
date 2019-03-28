import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';
import StaticContainer from 'react-static-container';
import warning from 'warning';

import { routerShape } from './PropTypes';
import createRender from './createRender';
import resolveRenderArgs from './utils/resolveRenderArgs';

export default function createBaseRouter({
  render,
  renderPending,
  renderReady,
  renderError,
}) {
  // eslint-disable-next-line no-param-reassign
  render =
    render ||
    createRender({
      renderPending,
      renderReady,
      renderError,
    });

  const propTypes = {
    match: PropTypes.object.isRequired,
    resolvedMatch: PropTypes.object.isRequired,
    matchContext: PropTypes.any,
    resolver: PropTypes.shape({
      resolveElements: PropTypes.func.isRequired,
    }).isRequired,
    router: routerShape.isRequired,
    onResolveMatch: PropTypes.func.isRequired,
    initialRenderArgs: PropTypes.object,
  };

  class BaseRouter extends React.Component {
    constructor(props) {
      super(props);

      const { initialRenderArgs } = props;

      this.state = {
        element: initialRenderArgs ? render(initialRenderArgs) : null,
      };

      this.mounted = true;
      this.lastRenderArgs = initialRenderArgs;

      this.shouldResolveMatch = false;
      this.pendingResolvedMatch = false;
    }

    // We use componentDidMount and componentDidUpdate to resolve the match if
    // needed because element resolution is asynchronous anyway, and this lets
    // us not worry about setState not being available in the constructor, or
    // about having to pass around nextProps.

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
            'Replacing existing hot reloading hook. Do not render more than ' +
              'one router instance when using hot reloading.',
          );

          window.__FOUND_REPLACE_ROUTE_CONFIG__ = this.props.router.replaceRouteConfig;
        }
        /* eslint-enable no-underscore-dangle */
        /* eslint-env browser: false */
      }
    }

    componentWillReceiveProps(nextProps) {
      warning(
        nextProps.router === this.props.router,
        '<BaseRouter> does not support changing the router object.',
      );

      if (
        nextProps.match !== this.props.match ||
        nextProps.resolver !== this.props.resolver ||
        !isEqual(nextProps.matchContext, this.props.matchContext)
      ) {
        this.shouldResolveMatch = true;
      }
    }

    componentDidUpdate() {
      if (this.shouldResolveMatch) {
        this.shouldResolveMatch = false;
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

    handleMaybeRedirectException(e) {
      if (!e.isFoundRedirectException) {
        return false;
      }

      this.props.router.replace(e.location);
      return true;
    }

    async resolveMatch() {
      const pendingMatch = this.props.match;

      try {
        for await (const renderArgs of resolveRenderArgs(this.props)) {
          if (!this.mounted || this.props.match !== pendingMatch) {
            return;
          }

          // If we're about to mark the match resolved, delay the rerender
          // until we do so.
          this.pendingResolvedMatch = !!(
            (renderArgs.elements || renderArgs.error) &&
            this.props.resolvedMatch !== pendingMatch
          );

          this.lastRenderArgs = renderArgs;
          this.updateElement();

          if (this.pendingResolvedMatch) {
            // If this is a new match, update the store, so we can rerender at
            // the same time as all of the links and other components connected
            // to the router state.
            this.pendingResolvedMatch = false;
            this.props.onResolveMatch(pendingMatch);
          }
        }
      } catch (e) {
        if (this.handleMaybeRedirectException(e)) {
          return;
        }

        throw e;
      }
    }

    updateElement() {
      this.setState({
        element: render(this.lastRenderArgs),
      });
    }

    componentDidCatch(error) {
      if (this.handleMaybeRedirectException(error)) {
        return;
      }

      if (error.isFoundHttpError) {
        this.lastRenderArgs = { ...this.lastRenderArgs, error };
        this.updateElement();
      }
    }

    render() {
      // Don't rerender synchronously if we have another rerender coming. Just
      // memoizing the element here doesn't do anything because we're using
      // context.
      return (
        <StaticContainer
          shouldUpdate={!this.shouldResolveMatch && !this.pendingResolvedMatch}
        >
          {this.state.element}
        </StaticContainer>
      );
    }
  }

  BaseRouter.propTypes = propTypes;

  return BaseRouter;
}
