import React from 'react';

/**
 * Create a route configuration from JSX configuration elements.
 */
export default function makeRouteConfig(node) {
  return React.Children.toArray(node)
    .filter(React.isValidElement)
    .map(({ type: Type, props: { children, ...props } }) => {
      if (__DEV__ && Type.prototype.constructor !== Type) {
        // With React Hot Loader, this might actually be a proxy. We're not
        // actually rendering this and we want the real class instead. This
        // isn't a problem here, but can come when users extend route classes.
        Type = Type.prototype.constructor; // eslint-disable-line no-param-reassign
      }

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
