// @flow
import isEqual from 'lodash/isEqual';
import React from 'react';
import StaticContainer from 'react-static-container';
import warning from 'warning';

import { routerShape } from './PropTypes';
import RedirectException from './RedirectException';
import resolveRenderArgs from './utils/resolveRenderArgs';

export default function createBaseRouter({ render }: any) {
  const propTypes = {
    match: React.PropTypes.object.isRequired,
    resolvedMatch: React.PropTypes.object.isRequired,
    matchContext: React.PropTypes.any,
    resolveElements: React.PropTypes.func.isRequired,
    router: routerShape.isRequired,
    onResolveMatch: React.PropTypes.func.isRequired,
    initialRenderArgs: React.PropTypes.object,
  };

  const childContextTypes = {
    router: routerShape.isRequired,
  };

  class BaseRouter extends React.Component {
    constructor(props: any, context: any) {
      super(props, context);

      const { router, initialRenderArgs } = props;

      this.state = {
        element: initialRenderArgs ? render(initialRenderArgs) : null,
      };

      this.mounted = true;

      this.shouldResolveMatch = false;
      this.pendingResolvedMatch = false;

      this.childContext = { router };
    }

    state: {
      element: any,
    };

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

    componentWillReceiveProps(nextProps: any) {
      warning(
        nextProps.router === this.props.router,
        '<BaseRouter> does not support changing the router object.',
      );

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

    mounted: boolean;
    shouldResolveMatch: boolean;
    pendingResolvedMatch: boolean;
    childContext: any;

    async resolveMatch() {
      const pendingMatch = this.props.match;

      try {
        // ESLint doesn't handle for-await yet.
        // eslint-disable-next-line semi
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

          this.setState({ element: render(renderArgs) });

          if (this.pendingResolvedMatch) {
            // If this is a new match, update the store, so we can rerender at
            // the same time as all of the links and other components connected
            // to the router state.
            this.pendingResolvedMatch = false;
            this.props.onResolveMatch(pendingMatch);
          }
        }
      } catch (e) {
        if (e instanceof RedirectException) {
          this.props.router.replace(e.location);
          return;
        }

        throw e;
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
