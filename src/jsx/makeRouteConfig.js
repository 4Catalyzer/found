// @flow
import React from 'react';

export default function makeRouteConfig(node: any) {
  return React.Children.toArray(node)
    .filter(React.isValidElement)
    .map(({ type, props: { children, ...props } }) => {
      const route = type.createRoute(props);

      if (children) {
        route.children = makeRouteConfig(children);
      }

      return route;
    });
}
