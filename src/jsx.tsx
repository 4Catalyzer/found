import { Children, Component, Fragment, isValidElement } from 'react';

import { RedirectOptions, RouteObject, RouteProps } from './typeUtils';
import { RouteConfig } from './typeUtils';
import createRedirect from './createRedirect';

export class Redirect extends Component<RedirectOptions> {
  static isFoundComponent = true;

  static toRoute(props: RedirectOptions) {
    return createRedirect(props);
  }

  render() {
    return null;
  }
}

export class Route extends Component<RouteProps> {
  static isFoundComponent = true;

  static toRoute(props: RouteProps) {
    return props as RouteObject;
  }

  render() {
    return null;
  }
}

type RouteCtor = typeof Route;
type RedirectCtor = typeof Redirect;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function isFoundComponent(type: Function): type is RedirectCtor | RouteCtor {
  return 'isFoundComponent' in type && !!type.isFoundComponent;
}

// TODO: what is even happening in this file? Try to fix as any's(+ maybe simplify)
function buildRouteConfig(
  node: React.ReactNode,
  routeConfig: any[],
): RouteConfig {
  Children.forEach(node, (child) => {
    // Falsy children get coerced to null. We check for this instead of
    // implicit falsiness because we don't want to allow empty strings or 0.
    if (child === null) {
      return;
    }

    if (!isValidElement(child)) {
      throw new TypeError(`\`${child}\` is not a valid React element`);
    }

    const Type = child.type as React.JSXElementConstructor<any>;
    const { children, ...props } = child.props as any;

    if (Type === Fragment) {
      buildRouteConfig(children, routeConfig);
      return;
    }

    if (!isFoundComponent(Type)) {
      throw new TypeError(`\`${Type}\` is not a valid found JSX element type`);
    }

    const route = Type.toRoute(props);

    if (children) {
      if (isValidElement(children) || Array.isArray(children)) {
        route.children = buildRouteConfig(children, []);
      } else {
        const routeGroups: Record<string, RouteConfig> = {};
        Object.entries(children).forEach(([groupName, groupRoutes]: any[]) => {
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
export function makeRouteConfig(node: React.ReactNode): RouteConfig {
  return buildRouteConfig(node, []);
}
