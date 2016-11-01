import isEqual from 'lodash/isEqual';
import React from 'react';
import StaticContainer from 'react-static-container';

import getRoutes from './getRoutes';
import HttpError from './HttpError';
import { routerShape } from './PropTypes';
import RedirectException from './RedirectException';

export default function createBaseRouter({ routeConfig, matcher, render }) {
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
    isActive: React.PropTypes.func.isRequired,
    initialRenderArgs: React.PropTypes.object,
  };

  const childContextTypes = {
    router: routerShape.isRequired,
  };

  class BaseRouter extends React.Component {
    constructor(props, context) {
      super(props, context);

      const { initialRenderArgs } = props;

      this.state = {
        element: initialRenderArgs ? render(initialRenderArgs) : null,
      };

      this.mounted = true;
    }

    getChildContext() {
      const {
        push,
        replace,
        go,
        createHref,
        createLocation,
        isActive,
      } = this.props;

      return {
        router: {
          push,
          replace,
          go,
          createHref,
          createLocation,
          isActive,
        },
      };
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

    componentDidUpdate(prevProps) {
      if (
        this.props.match !== prevProps.match ||
        this.props.resolveElements !== prevProps.resolveElements ||
        !isEqual(this.props.matchContext, prevProps.matchContext)
      ) {
        this.resolveMatch();
      }
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    async resolveMatch() {
      const { match, matchContext, resolveElements } = this.props;

      // TODO: Use Reselect for this?
      const routes = getRoutes(routeConfig, match);
      const augmentedMatch = {
        ...match,
        routes,
        matcher, // For e.g. Redirect to format pattern.
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

          if (!elements) {
            continue; // eslint-disable-line no-continue
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
      this.setState({ element: render(renderArgs) });

      const { resolvedMatch, match } = this.props;

      if (resolvedMatch !== match) {
        // If this is a new match, update the store, so we can rerender at the
        // same time as all of the links and other components connected to the
        // router state.
        this.props.onResolveMatch(match);
      }
    }

    render() {
      const { resolvedMatch, match } = this.props;

      // Normally, returning the same ReactElement is sufficient to skip
      // reconciliation. However, that doesn't work with context. Additionally,
      // we only need to block rerendering while a match is pending anyway.
      return (
        <StaticContainer shouldUpdate={resolvedMatch === match}>
          {this.state.element}
        </StaticContainer>
      );
    }
  }

  BaseRouter.propTypes = propTypes;
  BaseRouter.childContextTypes = childContextTypes;

  return BaseRouter;
}
