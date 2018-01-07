import isEqual from 'lodash/isEqual';
import pathToRegexp from 'path-to-regexp';
import warning from 'warning';

export default class Matcher {
  constructor(routeConfig) {
    this.routeConfig = routeConfig;

    // Overly-aggressive deduplication of packages can lead to the wrong
    // version of path-to-regexp getting bundled. This is a common enough
    // failure mode that it's worthwhile to add a dev-only warning here.
    warning(
      typeof pathToRegexp.compile === 'function',
      'Incorrect version of path-to-regexp imported. If this is running ' +
        'from a client bundle, check your bundler settings.',
    );
  }

  match({ pathname }) {
    const matches = this.matchRoutes(this.routeConfig, pathname);
    if (!matches) {
      return null;
    }

    return this.makePayload(matches);
  }

  getRoutes({ routeIndices }) {
    if (!routeIndices) {
      return null;
    }

    return this.getRoutesFromIndices(routeIndices, this.routeConfig);
  }

  joinPaths(basePath, path) {
    if (!path) {
      return basePath;
    }

    if (basePath.charAt(basePath.length - 1) === '/') {
      // eslint-disable-next-line no-param-reassign
      basePath = basePath.slice(0, -1);
    }

    return `${basePath}${this.getCanonicalPattern(path)}`;
  }

  isActive({ location: matchLocation }, location, { exact } = {}) {
    return (
      this.isPathnameActive(
        matchLocation.pathname,
        location.pathname,
        exact,
      ) && this.isQueryActive(matchLocation.query, location.query)
    );
  }

  format(pattern, params) {
    return pathToRegexp.compile(pattern)(params);
  }

  matchRoutes(routeConfig, pathname) {
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
        } else {
          const groups = this.matchGroups(children, remaining);
          if (groups) {
            return [{ index, params }, { groups }];
          }
        }
      }

      if (!remaining) {
        return [{ index, params }];
      }
    }

    return null;
  }

  matchRoute(route, pathname) {
    const routePath = route.path;
    if (!routePath) {
      return {
        params: {},
        remaining: pathname,
      };
    }

    const pattern = this.getCanonicalPattern(routePath);
    let keys = [];
    const regexp = pathToRegexp(pattern, keys, { end: false });

    const match = regexp.exec(pathname);
    if (match === null) {
      return null;
    }

    const params = Object.create(null);
    keys.forEach(({ name }, index) => {
      const value = match[index + 1];
      params[name] = value && decodeURIComponent(value);
    });

    return {
      params,
      remaining: pathname.slice(match[0].length),
    };
  }

  getCanonicalPattern(pattern) {
    return pattern.charAt(0) === '/' ? pattern : `/${pattern}`;
  }

  matchGroups(routeGroups, pathname) {
    const groups = {};

    for (const [groupName, routes] of Object.entries(routeGroups)) {
      const groupMatch = this.matchRoutes(routes, pathname);
      if (!groupMatch) {
        return null;
      }

      groups[groupName] = groupMatch;
    }

    return groups;
  }

  makePayload(matches) {
    const routeMatch = matches[0];

    if (routeMatch.groups) {
      warning(
        matches.length === 1,
        'Route match with groups %s has children, which are ignored.',
        Object.keys(routeMatch.groups).join(', '),
      );

      const routeIndices = {};
      const routeParams = [];
      const params = {};

      Object.entries(routeMatch.groups).forEach(
        ([groupName, groupMatches]) => {
          const groupPayload = this.makePayload(groupMatches);

          // Retain the nested group structure for route indices so we can
          // reconstruct the element tree from flattened route elements.
          routeIndices[groupName] = groupPayload.routeIndices;

          // Flatten route groups for route params matching getRoutesFromIndices
          // below.
          routeParams.push(...groupPayload.routeParams);

          // Just merge all the params depth-first; it's the easiest option.
          Object.assign(params, groupPayload.params);
        },
      );

      return { routeIndices, routeParams, params };
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

  getRoutesFromIndices(routeIndices, routeConfigOrGroups) {
    const routeIndex = routeIndices[0];

    if (typeof routeIndex === 'object') {
      // Flatten route groups to save resolvers from having to explicitly
      // handle them.
      const groupRoutes = [];
      Object.entries(routeIndex).forEach(([groupName, groupRouteIndices]) => {
        groupRoutes.push(
          ...this.getRoutesFromIndices(
            groupRouteIndices,
            routeConfigOrGroups[groupName],
          ),
        );
      });

      return groupRoutes;
    }

    const route = routeConfigOrGroups[routeIndex];

    if (routeIndices.length === 1) {
      return [route];
    }

    return [
      route,
      ...this.getRoutesFromIndices(routeIndices.slice(1), route.children),
    ];
  }

  isPathnameActive(matchPathname, pathname, exact) {
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

  isQueryActive(matchQuery, query) {
    if (!query) {
      return true;
    }

    return Object.entries(query).every(
      ([key, value]) =>
        Object.prototype.hasOwnProperty.call(matchQuery, key)
          ? isEqual(matchQuery[key], value)
          : value === undefined,
    );
  }
}
