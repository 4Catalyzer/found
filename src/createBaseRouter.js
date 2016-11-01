import isEqual from 'lodash/isEqual';
import React from 'react';

import getRoutes from './getRoutes';
import HttpError from './HttpError';
import { routerShape } from './PropTypes';
import RedirectException from './RedirectException';

export default function createBaseRouter({ routeConfig, matcher, render }) {
  const propTypes = {
    match: React.PropTypes.object.isRequired,
    matchContext: React.PropTypes.any,
    resolveElements: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    replace: React.PropTypes.func.isRequired,
    go: React.PropTypes.func.isRequired,
    createHref: React.PropTypes.func.isRequired,
    createLocation: React.PropTypes.func.isRequired,
    isActive: React.PropTypes.func.isRequired,
    initialState: React.PropTypes.object,
  };

  const childContextTypes = {
    router: routerShape.isRequired,
  };

  class BaseRouter extends React.Component {
    constructor(props, context) {
      super(props, context);

      const { initialState } = props;

      this.state = {
        element: initialState ? render(initialState) : null,
      };

      this.matchIndex = 0;
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
      if (!this.props.initialState) {
        this.resolveMatch();
      }
    }

    componentDidUpdate(prevProps) {
      if (
        this.props.match !== prevProps.match ||
        !isEqual(this.props.matchContext, prevProps.matchContext)
      ) {
        ++this.matchIndex;
        this.resolveMatch();
      }
    }

    componentWillUnmount() {
      this.matchIndex = NaN; // This will fail all equality checks.
    }

    async resolveMatch() {
      const currentMatchIndex = this.matchIndex;
      const { match, matchContext, resolveElements } = this.props;
      const routes = getRoutes(routeConfig, match);

      const augmentedMatch = {
        ...match,
        routes,
        matcher, // For e.g. Redirect to format pattern.
        context: matchContext,
      };

      if (!routes) {
        // Immediately render a "not found" error if no routes matched.
        this.setState({
          element: render({ ...augmentedMatch, error: new HttpError(404) }),
        });
        return;
      }

      try {
        // ESLint doesn't handle for-await yet.
        for await (const elements of resolveElements(augmentedMatch)) { // eslint-disable-line semi
          if (this.matchIndex !== currentMatchIndex) {
            return;
          }

          if (!elements) {
            continue; // eslint-disable-line no-continue
          }

          this.setState({
            element: render({ ...augmentedMatch, elements }),
          });
        }
      } catch (e) {
        // Only handle exceptions we actually know about.
        if (!(e instanceof RedirectException || e instanceof HttpError)) {
          throw e;
        }

        if (this.matchIndex !== currentMatchIndex) {
          return;
        }

        if (e instanceof RedirectException) {
          this.props.replace(e.location);
          return;
        }

        this.setState({
          element: render({ ...augmentedMatch, error: e }),
        });
      }
    }

    render() {
      return this.state.element;
    }
  }

  BaseRouter.propTypes = propTypes;
  BaseRouter.childContextTypes = childContextTypes;

  return BaseRouter;
}
