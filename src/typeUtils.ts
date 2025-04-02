import {
  type FarceStoreExtension,
  type HistoryEnhancerOptions,
  type Location,
  type LocationDescriptor,
  type LocationDescriptorObject,
  type NavigationListener,
  type NavigationListenerOptions,
  type NavigationListenerResult,
  type Protocol,
  type Query,
  type QueryDescriptor,
} from 'farce';
import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Middleware, Reducer, Store, StoreEnhancer } from 'redux';

import HttpError from './HttpError';
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

export type Params = Record<string, string>;

export type ParamsDescriptor = Record<
  string,
  string | number | boolean | Record<string, unknown>
>;

// These need to be interfaces to avoid circular reference issues.

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GroupRouteIndices extends Record<string, RouteIndices> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RouteIndices extends Array<number | GroupRouteIndices> {}

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

// export const resolver: Resolver;

export interface FoundState {
  match: MatchBase;
  resolvedMatch: MatchBase;
}

// export const foundReducer: Reducer<FoundState>;

export interface IsActiveOptions {
  exact?: boolean;
}

/**
 * An object implementing the matching algorithm.
 *
 * User code generally shouldn't need this, but it doesn't hurt to here,
 * since we use it for routerShape below.
 */
// export class Matcher {
//   constructor(routeConfig: RouteConfig);

//   match(location: Location): MatcherResult | null;

//   getRoutes: (match: MatchBase) => RouteObject[];

//   /**
//    * for match as above, returns whether match corresponds to location or a
//    * subpath of location; if exact is set, returns whether match corresponds
//    * exactly to location
//    */
//   isActive: (
//     match: Match,
//     location: LocationDescriptorObject,
//     options?: IsActiveOptions,
//   ) => boolean;

//   /**
//    * Returns the path string for a pattern of the same format as a route path
//    * and a object of the corresponding path parameters
//    */
//   format: (pattern: string, params: ParamsDescriptor) => string;
// }

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

export interface RouteProps extends RouteObjectBase {
  children?: React.ReactNode | Record<string, React.ReactNode>;
}

/**
 * JSX Route
 */

export interface RedirectOptions {
  from?: string;
  to: string | ((match: Match) => LocationDescriptor);
  status?: number;
}

// It's more "natural" to call this "props" when used in the context of a
//  React component.
export type RedirectProps = RedirectOptions;

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

// export function createMatchEnhancer(
//   matcher: Matcher,
// ): StoreEnhancer<{ found: FoundStoreExtension }>;

export type RenderPendingArgs = Match;

// This is the folded resolver output from resolveRenderArgs.
export type RenderArgsElements = Array<
  ResolvedElement | Record<string, ResolvedElement[]>
>;

export interface RenderReadyArgs extends Match {
  elements: RenderArgsElements;
}

export interface RenderErrorArgs extends Match {
  error: HttpError;
}

export type RenderArgs = RenderPendingArgs | RenderReadyArgs | RenderErrorArgs;

export interface CreateRenderOptions {
  renderPending?: (args: RenderPendingArgs) => React.ReactElement;
  renderReady?: (args: RenderReadyArgs) => React.ReactElement;
  renderError?: (args: RenderErrorArgs) => React.ReactNode;
}

export interface ConnectedRouterOptions extends CreateRenderOptions {
  render?: (args: RenderArgs) => React.ReactElement;
  getFound?: (store: Store) => FoundState;
}

export interface ConnectedRouterProps {
  matchContext?: any;
  resolver: Resolver;
  initialRenderArgs?: RenderArgs;
}

export type ConnectedRouter = React.ComponentType<ConnectedRouterProps>;

export interface FarceRouterOptions extends ConnectedRouterOptions {
  store?: Store;
  historyProtocol: Protocol;
  historyMiddlewares?: Middleware[];
  historyOptions?: Omit<HistoryEnhancerOptions, 'protocol' | 'middlewares'>;
  routeConfig: RouteConfig;
}

export type FarceRouterProps = ConnectedRouterProps;

export type FarceRouter = React.ComponentType<FarceRouterProps>;

// export function createFarceRouter(options: FarceRouterOptions): FarceRouter;

export interface BrowserRouterOptions
  extends Omit<FarceRouterOptions, 'historyProtocol'> {
  render?: (args: RenderArgs) => React.ReactElement;
}

export interface BrowserRouterProps
  extends Omit<FarceRouterProps, 'resolver'> {
  resolver?: Resolver;
}

export type BrowserRouter = React.ComponentType<BrowserRouterProps>;

// export function createBrowserRouter(
//   options: BrowserRouterOptions,
// ): BrowserRouter;

export interface InitialFarceRouterOptions
  extends Omit<FarceRouterOptions, 'store'> {
  matchContext?: any;
  resolver: Resolver;
}

// export function createInitialFarceRouter(
//   options: InitialFarceRouterOptions,
// ): Promise<FarceRouter>;

export type InitialBrowserRouterOptions = Omit<
  InitialFarceRouterOptions,
  'resolver' | 'historyProtocol'
>;

// export function createInitialBrowserRouter(
//   options: InitialBrowserRouterOptions,
// ): Promise<BrowserRouter>;

export interface ElementsRendererProps {
  elements: RenderArgsElements;
}

export type ElementsRenderer =
  React.ComponentType<ElementsRendererProps> | null;

export interface GetStoreRenderArgsOptions {
  store: Store;
  getFound?: (store: Store) => FoundState;
  matchContext: any;
  resolver: Resolver;
}

// export function getStoreRenderArgs(
//   options: GetStoreRenderArgsOptions,
// ): Promise<RenderArgs>;
