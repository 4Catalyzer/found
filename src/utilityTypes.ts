/* eslint-disable max-classes-per-file */
// TypeScript Version: 4.0

import {
  FarceStoreExtension,
  Location,
  LocationDescriptor,
  LocationDescriptorObject,
  NavigationListener,
  NavigationListenerOptions,
  NavigationListenerResult,
  Query,
  QueryDescriptor,
} from 'farce';
import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Middleware, Reducer, Store, StoreEnhancer } from 'redux';

import Matcher from './Matcher';

export {
  type Query,
  type QueryDescriptor,
  type Location,
  type LocationDescriptor,
  type LocationDescriptorObject,
  type NavigationListenerOptions,
  type NavigationListenerResult,
  type NavigationListener,
};

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// export const ActionTypes: {
//   UPDATE_MATCH: '@@found/UPDATE_MATCH';
//   RESOLVE_MATCH: '@@found/RESOLVE_MATCH';
// };

export type Params = Record<string, string>;

export type ParamsDescriptor = Record<
  string,
  string | number | boolean | Record<string, unknown>
>;

// These need to be interfaces to avoid circular reference issues.
/* eslint-disable @typescript-eslint/no-empty-interface */
export interface GroupRouteIndices extends Record<string, RouteIndices> {}
export interface RouteIndices extends Array<number | GroupRouteIndices> {}
/* eslint-enable @typescript-eslint/no-empty-interface */

export interface MatcherResult {
  routeIndices: RouteIndices;
  routeParams: Params[];
  /**
   * The union of path parameters for *all* matched routes
   */
  params: Params;
}

export interface MatchBase extends MatcherResult {
  /**
   * The current location
   */
  location: Location;
}

/**
 * The shape might be different with a custom matcher or history enhancer,
 * but the default matcher assumes and provides this shape. As such, this
 * validator is purely for user convenience and should not be used
 * internally.
 */
export interface Match<TContext = any> extends MatchBase {
  /**
   * An array of all matched route objects
   */
  routes: RouteObject[];
  /**
   * An object with static router properties.
   */
  router: Router;

  /**
   * matchContext from the router
   */
  context: TContext;
}

export interface Resolver {
  resolveElements(
    match: Match,
  ): AsyncGenerator<Array<ResolvedElement> | undefined>;
}

export interface FoundState {
  match: MatchBase;
  resolvedMatch: MatchBase;
}

export interface IsActiveOptions {
  exact?: boolean;
}

export interface Router extends FarceStoreExtension, FoundStoreExtension {
  /**
   * Navigates to a new location
   * @see farce
   */
  push: (location: LocationDescriptor) => void;
  /**
   * Replace the current history entry
   * @see farce
   */
  replace: (location: LocationDescriptor) => void;
  /**
   * Moves delta steps in the history stack
   * @see farce
   *
   */
  go: (delta: number) => void;

  isActive: Matcher['isActive'];
}

/**
 * A near superset of Match.
 * The match for a specific route, including that route and its own params.
 */
export interface RouteMatch extends Omit<Match, 'routeParams'> {
  /**
   * The route object or array corresponding to this component
   */
  route: RouteObject[] | RouteObject;
  /**
   * The path parameters for route
   */
  routeParams: Params;
}

export interface RenderProps extends RouteMatch {
  /**
   * The data for the route, as above; null if the data have not yet been
   * loaded
   */
  data?: any;
}

/**
 * @see https://github.com/4Catalyzer/found/blob/master/README.md#render
 */
export interface RouteRenderArgs {
  match: Match;
  /**
   * The component for the route, if any; null if the component has not yet
   * been loaded
   */
  Component?: React.ComponentType<any> | null;
  /**
   * The default props for the route component, specifically match with data
   * as an additional property; null if data have not yet been loaded
   */
  props?: RenderProps | null;
  /**
   * The data for the route, as above; null if the data have not yet been
   * loaded
   */
  data?: any;
}

export type ResolvedElementValue = React.ReactElement | null;
export type ResolvedElement =
  | ResolvedElementValue
  | ((element: React.ReactElement) => ResolvedElementValue)
  | ((groups: Record<string, React.ReactElement>) => ResolvedElementValue);

export interface RouteRenderMethod {
  (args: RouteRenderArgs): ResolvedElement | undefined;
}

/**
 * Shared properties between JSX and object routes.
 */
export interface RouteObjectBase {
  /**
   * a string defining the pattern for the route
   */
  path?: string;
  /**
   * the component for the route
   */
  Component?: React.ComponentType<any>;
  /**
   * a method that returns the component for the route
   */
  getComponent?: (
    match: RouteMatch,
  ) => React.ComponentType<any> | Promise<React.ComponentType<any>>;
  /**
   * additional data for the route
   */
  data?: any;
  /**
   * a method that returns additional data for the route
   */
  getData?: (match: RouteMatch) => any;
  /**
   * whether to defer getting data until ancestor data promises are resolved
   */
  defer?: boolean;
  /**
   * @throws {HttpError}
   * @throws {RedirectException}
   */
  render?: RouteRenderMethod;

  /**
   * Convenience prop for indicating a Route with children also functions
   * as it's own index route.
   *
   * ```tsx
   * <Route allowAsIndex path='parent' Component={Page}>
   *    <Route path='child' Component={ChildPage}/>
   * </Route>
   * ```
   *
   * This is equivalent to when matching `'/parent'`:
   * ```tsx
   * <Route path='parent' Component={Page}>
   *    <Route Component={() => null}/>
   *    <Route path='child' Component={ChildPage}/>
   * </Route>
   * ```
   */
  allowAsIndex?: boolean;

  // Provide indexer allowing for other properties.
  [key: string]: any;
}

/**
 * Plain JavaScript route object, possibly from a resolved JSX route.
 */
export interface RouteObject extends RouteObjectBase {
  children?: RouteConfig | Record<string, RouteConfig>;
}

export type RouteConfig = RouteObject[];

export interface RouterState<TContext = any> {
  match: Match<TContext>;
  router: Router;
}

export type RouterProps<TContext> = RouterState<TContext>;

export interface RouteComponentProps<TContext = never>
  extends RouterProps<TContext> {
  children?: React.ReactElement | null;
}

export interface RouteComponentDataProps<T, TContext = never>
  extends RouteComponentProps<TContext> {
  data: T;
}

export interface FoundStoreExtension {
  matcher: Matcher;
  replaceRouteConfig: (routeConfig: RouteConfig) => void;
}
