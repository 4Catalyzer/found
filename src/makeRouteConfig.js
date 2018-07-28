import React from 'react';

function buildRouteConfig(node, routeConfig) {
  React.Children.forEach(node, child => {
    if (!React.isValidElement(child)) {
      return;
    }

    let Type = child.type;
    const { children, ...props } = child.props;

    if (Type === React.Fragment) {
      buildRouteConfig(children, routeConfig);
      return;
    }

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
        // eslint-disable-next-line no-use-before-define
        route.children = makeRouteConfig(children);
      } else {
        const routeGroups = {};
        Object.entries(children).forEach(([groupName, groupRoutes]) => {
          // eslint-disable-next-line no-use-before-define
          routeGroups[groupName] = makeRouteConfig(groupRoutes);
        });

        route.children = routeGroups;
      }
    }

    routeConfig.push(route);
  });

  return routeConfig;
}

/**
 * Create a route configuration from JSX configuration elements.
 */
export default function makeRouteConfig(node) {
  return buildRouteConfig(node, []);
}
