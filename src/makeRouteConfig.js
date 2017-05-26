import React from 'react';

/**
 * Create a route configuration from JSX configuration elements.
 */
export default function makeRouteConfig(node) {
  return React.Children.toArray(node)
    .filter(React.isValidElement)
    .map(({ type: Type, props: { children, ...props } }) => {
      const route = new Type(props);

      if (children) {
        route.children = makeRouteConfig(children);
      }

      return route;
    });
}
