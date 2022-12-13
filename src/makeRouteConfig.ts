import React from 'react';

import { RouteConfig } from './typeUtils';

// TODO: what is even happening in this file? Try to fix as any's(+ maybe simplify)
function buildRouteConfig(
  node: React.ReactNode,
  routeConfig: any[],
): RouteConfig {
  React.Children.forEach(node, (child) => {
    // Falsy children get coerced to null. We check for this instead of
    // implicit falsiness because we don't want to allow empty strings or 0.
    if (child === null) {
      return;
    }

    if (!React.isValidElement(child)) {
      throw new TypeError(`\`${child}\` is not a valid React element`);
    }

    let Type = child.type as React.JSXElementConstructor<any>;
    const { children, ...props } = child.props;

    if (Type === React.Fragment) {
      buildRouteConfig(children, routeConfig);
      return;
    }

    if (__DEV__) {
      if ((Type as any).prototype.constructor !== Type) {
        // Unwrap proxies from react-proxy. This isn't strictly necessary.
        // eslint-disable-next-line no-param-reassign
        Type = (Type as any).prototype.constructor;
      } else if (
        // eslint-disable-next-line no-underscore-dangle
        (Type as any).__reactstandin__getCurrent
      ) {
        // Unwrap proxies from react-stand-in.
        // eslint-disable-next-line no-param-reassign
        Type = Object.getPrototypeOf(Type);
      }
    }

    const route = new (Type as any)(props);

    if (children) {
      if (React.isValidElement(children) || Array.isArray(children)) {
        // eslint-disable-next-line no-use-before-define
        route.children = buildRouteConfig(children, []);
      } else {
        const routeGroups: Record<string, RouteConfig> = {};
        Object.entries(children).forEach(([groupName, groupRoutes]: any[]) => {
          // eslint-disable-next-line no-use-before-define
          routeGroups[groupName] = buildRouteConfig(groupRoutes, []);
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
export default function makeRouteConfig(node: React.ReactNode): RouteConfig {
  return buildRouteConfig(node, []);
}
