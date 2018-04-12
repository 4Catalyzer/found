import React from 'react';

/**
 * Create a route configuration from JSX configuration elements.
 */
export default function makeRouteConfig(node) {
  return React.Children.toArray(node)
    .filter(React.isValidElement)
    .map(({ type: Type, props: { children, ...props } }) => {
      if (__DEV__) {
        if (Type.prototype.constructor !== Type) {
          // Unwrap proxies from react-proxy. This isn't strictly necessary.
          // eslint-disable-next-line no-param-reassign
          Type = Type.prototype.constructor;
        } else if (
          // eslint-disable-next-line no-underscore-dangle
          Type.__reactstandin__getCurrent
        ) {
          // Unwrap proxies from react-stand-in.
          // eslint-disable-next-line no-param-reassign
          Type = Object.getPrototypeOf(Type);
        }
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
