import isEqual from 'lodash/isEqual';
import React from 'react';
import StaticContainer from 'react-static-container';

import getRoutes from './getRoutes';
import HttpError from './HttpError';
import { routerShape } from './PropTypes';
import RedirectException from './RedirectException';

export default function createBaseRouter({
  routeConfig,
  matcher,
  render,
}) {
  const propTypes = {
    match: React.PropTypes.object.isRequired,
    resolvedMatch: React.PropTypes.object.isRequired,
    matchContext: React.PropTypes.any,
    resolveElements: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    replace: React.PropTypes.func.isRequired,
    go: React.PropTypes.func.isRequired,
    onResolveMatch: React.PropTypes.func.isRequired,
    createHref: React.PropTypes.func.isRequired,
    createLocation: React.PropTypes.func.isRequired,
    addTransitionHook: React.PropTypes.func.isRequired,
    isActive: React.PropTypes.func.isRequired,
    initialRenderArgs: React.PropTypes.object,
  };

  const childContextTypes = {
    router: routerShape.isRequired,
  };

  class BaseRouter extends React.Component {
    constructor(props, context) {
      super(props, context);

      const {
        push,
        replace,
        go,
        createHref,
        createLocation,
        isActive,
        addTransitionHook,
        initialRenderArgs,
      } = props;

      this.state = {
        element: initialRenderArgs ? render(initialRenderArgs) : null,
      };

      this.mounted = true;

      this.shouldResolveMatch = false;
      this.pendingResolvedMatch = false;

      // By assumption, the methods on the router context should never change.
      this.router = {
        push,
        replace,
        go,
        createHref,
        createLocation,
        isActive,
        addTransitionHook,
      };

      this.childContext = {
        router: this.router,
      };
    }

    getChildContext() {
      return this.childContext;
    }

    // We use componentDidMount and componentDidUpdate to resolve the match if
    // needed because element resolution is asynchronous anyway, and this lets
    // us not worry about setState not being available in the constructor, or
    // about having to pass around nextProps.

    componentDidMount() {
      if (!this.props.initialRenderArgs) {
        this.resolveMatch();
      }
    }

    componentWillReceiveProps(nextProps) {
      if (
        nextProps.match !== this.props.match ||
        nextProps.resolveElements !== this.props.resolveElements ||
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
    }

    async resolveMatch() {
      const { match, matchContext, resolveElements } = this.props;

      const routes = getRoutes(routeConfig, match);
      const augmentedMatch = {
        ...match,
        routes,
        matcher, // For e.g. Redirect to format pattern.
        router: this.router, // Convenience access for route components.
        context: matchContext,
      };

      if (!routes) {
        // Immediately render a "not found" error if no routes matched.
        this.updateElement({ ...augmentedMatch, error: new HttpError(404) });
        return;
      }

      try {
        // ESLint doesn't handle for-await yet.
        // eslint-disable-next-line semi
        for await (const elements of resolveElements(augmentedMatch)) {
          if (!this.isResolvingMatch(match)) {
            return;
          }

          this.updateElement({ ...augmentedMatch, elements });
        }
      } catch (e) {
        // Only handle exceptions we actually know about.
        if (!(e instanceof RedirectException || e instanceof HttpError)) {
          throw e;
        }

        if (!this.isResolvingMatch(match)) {
          return;
        }

        if (e instanceof RedirectException) {
          this.props.replace(e.location);
          return;
        }

        this.updateElement({ ...augmentedMatch, error: e });
      }
    }

    isResolvingMatch(match) {
      return this.mounted && match === this.props.match;
    }

    updateElement(renderArgs) {
      const { resolvedMatch, match } = this.props;

      // If we're about to mark the match resolved, delay the rerender until we
      // do so.
      this.pendingResolvedMatch = !!(
        (renderArgs.elements || renderArgs.error) &&
        resolvedMatch !== match
      );

      this.setState({ element: render(renderArgs) });

      if (this.pendingResolvedMatch) {
        // If this is a new match, update the store, so we can rerender at the
        // same time as all of the links and other components connected to the
        // router state.
        this.pendingResolvedMatch = false;
        this.props.onResolveMatch(match);
      }
    }

    render() {
      // Don't rerender synchronously if we have another rerender coming. Just
      // memoizing the element here doesn't do anything because we're using
      // context.
      return (
        <StaticContainer
          shouldUpdate={
            !this.shouldResolveMatch &&
            !this.pendingResolvedMatch
          }
        >
          {this.state.element}
        </StaticContainer>
      );
    }
  }

  BaseRouter.propTypes = propTypes;
  BaseRouter.childContextTypes = childContextTypes;

  return BaseRouter;
}
