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
        if (React.isValidElement(children) || Array.isArray(children)) {
          route.children = makeRouteConfig(children);
        } else {
          const routeGroups = {};
          Object.entries(children).forEach(([groupName, groupRoutes]) => {
            routeGroups[groupName] = makeRouteConfig(groupRoutes);
          });

          route.children = routeGroups;
        }
      }

      return route;
    });
}
