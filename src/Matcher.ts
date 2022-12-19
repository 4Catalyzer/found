import { dequal } from 'dequal';
import warning from 'tiny-warning';

import pathToRegexp, { compile } from './pathToRegexp';
import type {
  IsActiveOptions,
  LocationDescriptorObject,
  Match,
  MatchBase,
  MatcherResult,
  Params,
  ParamsDescriptor,
  Query,
  QueryDescriptor,
  RouteConfig,
  RouteIndices,
  RouteObject,
} from './typeUtils';

export type RouteConfigGroups = Record<string, RouteConfig>;

export type IntermediateRouteMatch =
  | {
      index: number;
      params: Params;
    }
  | { groups: Record<string, IntermediateRouteMatch[]> };

export interface MatcherOptions {
  warnOnPotentialMissingIndexRoutes?: boolean;
  warnOnPartiallyMatchedNamedRoutes?: boolean;
}

export default class Matcher {
  private routeConfig: RouteConfig;

  private options: MatcherOptions;

  constructor(routeConfig: RouteConfig, options: MatcherOptions = {}) {
    this.routeConfig = routeConfig;

    this.options = {
      warnOnPotentialMissingIndexRoutes: true,
      warnOnPartiallyMatchedNamedRoutes: true,
      ...options,
    };
  }

  match({ pathname }: { pathname: string }) {
    const matches = this.matchRoutes(this.routeConfig, pathname);
    if (!matches) {
      return null;
    }

    return this.makePayload(matches);
  }

  getRoutes({ routeIndices }: MatchBase) {
    if (!routeIndices) {
      return null;
    }

    return this.getRoutesFromIndices(routeIndices, this.routeConfig);
  }

  protected joinPaths(basePath: string, path?: string | null) {
    if (!path) {
      return basePath;
    }

    if (basePath.charAt(basePath.length - 1) === '/') {
      // eslint-disable-next-line no-param-reassign
      basePath = basePath.slice(0, -1);
    }

    return `${basePath}${this.getCanonicalPattern(path)}`;
  }

  isActive(
    { location: matchLocation }: Match,
    location: LocationDescriptorObject,
    { exact = false }: IsActiveOptions = {},
  ) {
    return (
      this.isPathnameActive(
        matchLocation.pathname,
        location.pathname,
        exact,
      ) && this.isQueryActive(matchLocation.query, location.query)
    );
  }

  format(pattern: string, params: ParamsDescriptor): string {
    return compile(pattern)(params);
  }

  protected matchRoutes(
    routeConfig: RouteConfig,
    pathname: string,
  ): null | IntermediateRouteMatch[] {
    for (let index = 0; index < routeConfig.length; ++index) {
      const route = routeConfig[index];

      const match = this.matchRoute(route, pathname);
      if (!match) {
        continue; // eslint-disable-line no-continue
      }

      const { params, remaining } = match;
      const { children } = route;

      if (children) {
        if (Array.isArray(children)) {
          const childMatches = this.matchRoutes(children, remaining);
          if (childMatches) {
            return [{ index, params }, ...childMatches];
          }

          if (!remaining && route.allowAsIndex) {
            return [{ index, params }];
          }

          if (this.options.warnOnPotentialMissingIndexRoutes)
            warning(
              remaining,
              `Route matching pathname "${pathname}" has child routes, but no index route causing it to 404.\n` +
                `If this is intended ignore this warning otherwise in order to resolve this route add \`index\` to the route object or add route with no \`path\` and a \`Component\` to it's \`children\`.\n` +
                'This warning can be disabled by setting `warnOnPotentialMissingIndexRoutes` to `false` in the Matcher.',
            );
        } else {
          const groups = this.matchGroups(children, remaining, pathname);
          if (groups) {
            return [{ index, params }, { groups }];
          }
        }
      }

      if (!remaining && !children) {
        return [{ index, params }];
      }
    }

    return null;
  }

  protected matchRoute(route: RouteObject, pathname: string) {
    const routePath = route.path;
    if (!routePath) {
      return {
        params: {},
        remaining: pathname,
      };
    }

    const pattern = this.getCanonicalPattern(routePath);
    const keys: { name: string }[] = [];
    const regexp = pathToRegexp(pattern, keys, { end: false });

    const match = regexp.exec(pathname);
    if (match === null) {
      return null;
    }

    const params: Params = {};
    keys.forEach(({ name }, index) => {
      const value = match[index + 1];
      params[name] = value && decodeURIComponent(value);
    });

    return {
      params,
      remaining: pathname.slice(match[0].length),
    };
  }

  protected matchGroups(
    routeGroups: Record<string, RouteConfig>,
    pathname: string,
    parentPathname: string,
  ) {
    const groups: Record<string, IntermediateRouteMatch[]> = {};
    const failedGroups = [] as string[];
    const abortEarly =
      process.env.NODE_ENV === 'production' ||
      !this.options.warnOnPartiallyMatchedNamedRoutes;

    for (const [groupName, routes] of Object.entries(routeGroups)) {
      const groupMatch = this.matchRoutes(routes, pathname);
      if (!groupMatch) {
        if (abortEarly) {
          return null;
        }
        failedGroups.push(groupName);
      } else {
        groups[groupName] = groupMatch;
      }
    }

    if (failedGroups.length) {
      warning(
        !this.options.warnOnPartiallyMatchedNamedRoutes,
        `Route matching pathname "${parentPathname}" only partially matched against its named child routes causing it to 404. ` +
          `The following named routes failed to match "${pathname}":\n\n` +
          `${failedGroups.join(', ')}\n\n` +
          `If this is intended ignore this warning, otherwise the unmatched groups may need at catch all route "path=(.*)?".\n` +
          'This warning can be disabled by setting `warnOnPartiallyMatchedNamedRoutes` to `false` in the Matcher.',
      );
      return null;
    }
    return groups;
  }

  protected getCanonicalPattern(pattern: string) {
    return pattern.charAt(0) === '/' ? pattern : `/${pattern}`;
  }

  protected makePayload(matches: IntermediateRouteMatch[]): MatcherResult {
    const routeMatch = matches[0];

    if ('groups' in routeMatch) {
      warning(
        matches.length === 1,
        `Route match with groups ${Object.keys(routeMatch.groups).join(
          ', ',
        )} has children, which are ignored.`,
      );

      const groupRouteIndices: Record<string, RouteIndices> = {};
      const routeParams: MatcherResult['routeParams'] = [];
      const params = {};

      Object.entries(routeMatch.groups).forEach(
        ([groupName, groupMatches]) => {
          const groupPayload = this.makePayload(groupMatches);

          // Retain the nested group structure for route indices so we can
          // reconstruct the element tree from flattened route elements.
          groupRouteIndices[groupName] = groupPayload.routeIndices;

          // Flatten route groups for route params matching getRoutesFromIndices
          // below.
          routeParams.push(...groupPayload.routeParams);

          // Just merge all the params depth-first; it's the easiest option.
          Object.assign(params, groupPayload.params);
        },
      );

      return {
        routeIndices: [groupRouteIndices],
        routeParams,
        params,
      };
    }

    const { index, params } = routeMatch;

    if (matches.length === 1) {
      return {
        routeIndices: [index],
        routeParams: [params],
        params,
      };
    }

    const childPayload = this.makePayload(matches.slice(1));
    return {
      routeIndices: [index, ...childPayload.routeIndices],
      routeParams: [params, ...childPayload.routeParams],
      params: { ...params, ...childPayload.params },
    };
  }

  protected getRoutesFromIndices(
    routeIndices: RouteIndices,
    routeConfigOrGroups: RouteConfig | Record<string, RouteConfig> | undefined,
  ): RouteObject[] {
    const routeIndex = routeIndices[0];

    if (typeof routeIndex === 'object') {
      // Flatten route groups to save resolvers from having to explicitly
      // handle them.
      const groupRoutes = [];
      for (const [groupName, groupRouteIndices] of Object.entries(
        routeIndex,
      )) {
        groupRoutes.push(
          ...this.getRoutesFromIndices(
            groupRouteIndices,
            (routeConfigOrGroups as RouteConfigGroups)[groupName],
          ),
        );
      }

      return groupRoutes;
    }

    const route = (routeConfigOrGroups as RouteConfig)[routeIndex];

    if (routeIndices.length === 1) {
      return [route];
    }

    return [
      route,
      ...this.getRoutesFromIndices(routeIndices.slice(1), route.children),
    ];
  }

  isPathnameActive(matchPathname: string, pathname: string, exact?: boolean) {
    if (pathname === matchPathname) {
      return true;
    }

    if (exact) {
      // The above condition is necessary for an exact match.
      return false;
    }

    // Require that a partial match be followed by a path separator.
    const pathnameWithSeparator =
      pathname.slice(-1) !== '/' ? `${pathname}/` : pathname;

    // Can't use startsWith, as that requires a polyfill.
    return matchPathname.indexOf(pathnameWithSeparator) === 0;
  }

  isQueryActive(
    matchQuery: Query,
    query?: QueryDescriptor | undefined | null,
  ) {
    if (!query) {
      return true;
    }

    return Object.entries(query).every(([key, value]) =>
      Object.prototype.hasOwnProperty.call(matchQuery, key)
        ? dequal(matchQuery[key], value)
        : value === undefined,
    );
  }

  replaceRouteConfig(routeConfig: RouteConfig) {
    this.routeConfig = routeConfig;
  }
}
