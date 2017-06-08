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

    const routeIndices = new Array(matches.length);
    const routeParams = new Array(matches.length);
    const params = {};

    matches.forEach((routeMatch, i) => {
      routeIndices[i] = routeMatch.index;
      routeParams[i] = routeMatch.params;
      Object.assign(params, routeMatch.params);
    });

    return { routeIndices, routeParams, params };
  }

  getRoutes({ routeIndices }) {
    if (!routeIndices) {
      return null;
    }

    let lastRouteConfig = this.routeConfig;

    return routeIndices.map((routeIndex) => {
      const route = lastRouteConfig[routeIndex];
      lastRouteConfig = route.children;
      return route;
    });
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
        matchLocation.pathname, location.pathname, exact,
      ) &&
      this.isQueryActive(
        matchLocation.query, location.query,
      )
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

      const { children = [] } = route;
      const { params, remaining } = match;

      const childMatches = this.matchRoutes(children, remaining);
      if (childMatches) {
        return [{ index, params }, ...childMatches];
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
    const regexp = pathToRegexp(pattern, { end: false });

    const match = regexp.exec(pathname);
    if (match === null) {
      return null;
    }

    const params = Object.create(null);
    regexp.keys.forEach(({ name }, index) => {
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

  isPathnameActive(matchPathname, pathname, exact) {
    if (pathname === matchPathname) {
      return true;
    }

    if (exact) {
      // The above condition is necessary for an exact match.
      return false;
    }

    // Require that a partial match is followed by a path separator.
    const pathnameWithSeparator = pathname.slice(-1) !== '/' ?
      `${pathname}/` : pathname;

    // Can't use startsWith, as that requires a polyfill.
    return matchPathname.indexOf(pathnameWithSeparator) === 0;
  }

  isQueryActive(matchQuery, query) {
    if (!query) {
      return true;
    }

    return Object.entries(query).every(([key, value]) => (
      Object.prototype.hasOwnProperty.call(matchQuery, key) &&
        isEqual(matchQuery[key], value)
    ));
  }
}
