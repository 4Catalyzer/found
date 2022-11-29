import React from 'react';
/**
 * Convenience class for creating normal routes with JSX. When not using JSX,
 * use a POJSO instead of this class.
 */
export default class Route {
  constructor(props) {
    Object.assign(this, props);
  }
}

/**
 * Renders a route component with stale props while fetching the next route
 */
export function renderStaleWhileFetching(argsOrShouldInvalidate) {
  if (typeof argsOrShouldInvalidate === 'function') {
    return (args) => (
      <StaleWhileFetching
        {...args}
        shouldInvalidate={argsOrShouldInvalidate}
      />
    );
  }
  return <StaleWhileFetching {...argsOrShouldInvalidate} />;
}

/**
 * A router render function that does not wait for data to render itself.
 *
 * Useful if your component does not require its data or you want to control the loading
 * feedback directly
 */
export function renderWithoutData({ Component, props, match }) {
  return Component ? (
    <Component match={match} router={match.router} {...props} />
  ) : null;
}

if (__DEV__) {
  // Workaround to make React Proxy give me the original class, to allow
  // makeRouteConfig to get the actual class, when using JSX for routes.
  Route.prototype.isReactComponent = {};
}
