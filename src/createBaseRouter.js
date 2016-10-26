import React from 'react';

import getRoutes from './getRoutes';
import HttpError from './HttpError';
import RedirectException from './RedirectException';

export default function createBaseRouter({ routeConfig, matcher }) {
  const propTypes = {
    match: React.PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
    matchContext: React.PropTypes.any, // eslint-disable-line react/no-unused-prop-types
    resolveElements: React.PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    render: React.PropTypes.func.isRequired,
    replace: React.PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    initialState: React.PropTypes.object,
  };

  class BaseRouter extends React.Component {
    constructor(props, context) {
      super(props, context);

      const { initialState } = props;

      this.state = {
        element: initialState ? props.render(initialState) : null,
      };

      this.matchIndex = 0;

      if (!initialState) {
        this.resolveMatch(props);
      }
    }

    componentWillReceiveProps(nextProps) {
      ++this.matchIndex;
      this.resolveMatch(nextProps);
    }

    async resolveMatch({
      match, matchContext, resolveElements, render, replace,
    }) {
      const currentMatchIndex = this.matchIndex;
      const routes = getRoutes(routeConfig, match);
      const fullMatch = { ...match, routes, matcher, context: matchContext };

      try {
        // ESLint doesn't handle for-await yet.
        // eslint-disable-next-line semi
        for await (const elements of resolveElements(fullMatch)) {
          if (this.matchIndex !== currentMatchIndex) {
            return;
          }

          if (!elements) {
            continue; // eslint-disable-line no-continue
          }

          this.setState({
            element: render({ ...fullMatch, elements }),
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
          replace(e.location);
          return;
        }

        this.setState({
          element: render({ ...fullMatch, error: e }),
        });
      }
    }

    render() {
      return this.state.element;
    }
  }

  BaseRouter.propTypes = propTypes;

  return BaseRouter;
}
