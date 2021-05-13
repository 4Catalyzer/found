// TypeScript Version: 3.0

import {
  FarceStoreExtension,
  HistoryEnhancerOptions,
  Location,
  LocationDescriptor,
  LocationDescriptorObject,
  NavigationListener,
  NavigationListenerOptions,
  NavigationListenerResult,
  Protocol,
  Query,
  QueryDescriptor,
} from 'farce';
import * as React from 'react';
import { Middleware, Reducer, Store, StoreEnhancer } from 'redux';

export {
  Query,
  QueryDescriptor,
  Location,
  LocationDescriptor,
  LocationDescriptorObject,
  NavigationListenerOptions,
  NavigationListenerResult,
  NavigationListener,
};

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export const ActionTypes: {
  UPDATE_MATCH: '@@found/UPDATE_MATCH';
  RESOLVE_MATCH: '@@found/RESOLVE_MATCH';
};

export type Params = Record<string, string>;

export type ParamsDescriptor = Record<
  string,
  string | number | boolean | Record<string, unknown>
>;

// These need to be interfaces to avoid circular reference issues.
/* eslint-disable @typescript-eslint/no-empty-interface */
interface GroupRouteIndices extends Record<string, RouteIndices> {}
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
  resolveElements(match: Match): AsyncIterable<ResolvedElement[]>;
}

export const resolver: Resolver;

export interface FoundState {
  match: MatchBase;
  resolvedMatch: MatchBase;
}

export const foundReducer: Reducer<FoundState>;

export interface IsActiveOptions {
  exact?: boolean;
}

/**
 * An object implementing the matching algorithm.
 *
 * User code generally shouldn't need this, but it doesn't hurt to here,
 * since we use it for routerShape below.
 */
export class Matcher {
  constructor(routeConfig: RouteConfig);

  match(location: Location): MatcherResult | null;

  getRoutes: (match: MatchBase) => RouteObject[];

  /**
   * for match as above, returns whether match corresponds to location or a
   * subpath of location; if exact is set, returns whether match corresponds
   * exactly to location
   */
  isActive: (
    match: Match,
    location: LocationDescriptorObject,
    options?: IsActiveOptions,
  ) => boolean;

  /**
   * Returns the path string for a pattern of the same format as a route path
   * and a object of the corresponding path parameters
   */
  format: (pattern: string, params: ParamsDescriptor) => string;
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
   */
  go: (delta: number) => void;

  isActive: Matcher['isActive'];
}

/**
 * The match for a specific route, including that route and its own params.
 */
export interface RouteMatch extends Omit<Match, 'routeParams'> {
  /**
   * The route object corresponding to this component
   */
  route: RouteObject[];
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
  Component?: React.ComponentType<any>;
  /**
   * The default props for the route component, specifically match with data
   * as an additional property; null if data have not yet been loaded
   */
  props?: RenderProps;
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
export class Route extends React.Component<RouteProps> {
  constructor(options: RouteObject | RouteProps);
}

export function hotRouteConfig(routeConfig: RouteConfig): RouteConfig;

export class HttpError {
  status: number;

  data: any;

  constructor(status: number, data?: any);
}

export interface RedirectOptions {
  from?: string;
  to: string | ((match: Match) => LocationDescriptor);
  status?: number;
}

// It's more "natural" to call this "props" when used in the context of a
//  React component.
export type RedirectProps = RedirectOptions;

export class Redirect extends React.Component<RedirectProps> {
  constructor(config: RedirectOptions);
}

export interface LinkPropsCommon {
  to: LocationDescriptor;
  // match: Match,  provided by withRouter
  // router: Router, provided by withRouter
  exact?: boolean;
  target?: string;
  onClick?: (event: React.SyntheticEvent<any>) => void;
}

export interface LinkInjectedProps {
  href: string;
  onClick: (event: React.SyntheticEvent<any>) => void;
}

export interface LinkPropsNodeChild extends LinkPropsCommon {
  activeClassName?: string;
  activeStyle?: Record<string, unknown>;
  children?: React.ReactNode;
}

type ReplaceLinkProps<TInner extends React.ElementType, TProps> = Omit<
  React.ComponentProps<TInner>,
  keyof TProps | keyof LinkInjectedProps
> &
  TProps;

export type LinkPropsSimple = ReplaceLinkProps<'a', LinkPropsNodeChild>;

export type LinkPropsWithAs<
  TInner extends React.ElementType<LinkInjectedProps>
> = ReplaceLinkProps<
  TInner,
  LinkPropsNodeChild & {
    as: TInner;
    activePropName?: null;
  }
>;

export type LinkPropsWithActivePropName<
  TInner extends React.ComponentType<
    LinkInjectedProps & { [activePropName in TActivePropName]: boolean }
  >,
  TActivePropName extends string
> = ReplaceLinkProps<
  TInner,
  LinkPropsNodeChild & {
    as: TInner;
    activePropName: TActivePropName;
  } & {
      [activePropName in TActivePropName]?: null;
    }
>;

export interface LinkPropsWithFunctionChild extends LinkPropsCommon {
  children: (linkRenderArgs: {
    href: string;
    active: boolean;
    onClick: (event: React.SyntheticEvent<any>) => void;
  }) => React.ReactNode;
}

export type LinkProps<
  TInner extends React.ElementType = never,
  TInnerWithActivePropName extends React.ComponentType<
    LinkInjectedProps & { [activePropName in TActivePropName]: boolean }
  > = never,
  TActivePropName extends string = never
> =
  | LinkPropsSimple
  | LinkPropsWithAs<TInner>
  | LinkPropsWithActivePropName<TInnerWithActivePropName, TActivePropName>
  | LinkPropsWithFunctionChild;

export class Link<
  TInner extends React.ElementType = never,
  TInnerWithActivePropName extends React.ComponentType<
    LinkInjectedProps & { [activePropName in TActivePropName]: boolean }
  > = never,
  TActivePropName extends string = never
> extends React.Component<
  LinkProps<TInner, TInnerWithActivePropName, TActivePropName>
> {
  props: LinkProps<TInner, TInnerWithActivePropName, TActivePropName>;
}

export interface RouterState<TContext = any> {
  match: Match<TContext>;
  router: Router;
}

export type RouterProps<TContext> = RouterState<TContext>;

/**
 * Returns the Router and current route match from context
 */
export function useRouter<TContext = any>(): RouterState<TContext>;

/** Returns the current route Match */
export function useMatch<TContext = any>(): Match<TContext>;

/** Returns the current route params */
export function useParams(): Params;

/** Returns the current location object */
export function useLocation(): Location;

export function withRouter<TProps extends RouterState>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<Omit<TProps, keyof RouterState>>;

export class RedirectException {
  constructor(location: LocationDescriptor, status?: number);

  location: LocationDescriptor;

  status: number;
}

/**
 * Create a route configuration from JSX configuration elements.
 */
export function makeRouteConfig(node: React.ReactNode): RouteConfig;

export interface FoundStoreExtension {
  matcher: Matcher;
  replaceRouteConfig: (routeConfig: RouteConfig) => void;
}

export function createMatchEnhancer(
  matcher: Matcher,
): StoreEnhancer<{ found: FoundStoreExtension }>;

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

export function createRender(
  options: CreateRenderOptions,
): (renderArgs: RenderArgs) => React.ReactElement;

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

export function createConnectedRouter(
  options: ConnectedRouterOptions,
): ConnectedRouter;

export interface FarceRouterOptions extends ConnectedRouterOptions {
  store?: Store;
  historyProtocol: Protocol;
  historyMiddlewares?: Middleware[];
  historyOptions?: Omit<HistoryEnhancerOptions, 'protocol' | 'middlewares'>;
  routeConfig: RouteConfig;
}

export type FarceRouterProps = ConnectedRouterProps;

export type FarceRouter = React.ComponentType<FarceRouterProps>;

export function createFarceRouter(options: FarceRouterOptions): FarceRouter;

export interface BrowserRouterOptions
  extends Omit<FarceRouterOptions, 'historyProtocol'> {
  render?: (args: RenderArgs) => React.ReactElement;
}

export interface BrowserRouterProps
  extends Omit<FarceRouterProps, 'resolver'> {
  resolver?: Resolver;
}

export type BrowserRouter = React.ComponentType<BrowserRouterProps>;

export function createBrowserRouter(
  options: BrowserRouterOptions,
): BrowserRouter;

export interface InitialFarceRouterOptions
  extends Omit<FarceRouterOptions, 'store'> {
  matchContext?: any;
  resolver: Resolver;
}

export function createInitialFarceRouter(
  options: InitialFarceRouterOptions,
): Promise<FarceRouter>;

export type InitialBrowserRouterOptions = Omit<
  InitialFarceRouterOptions,
  'resolver' | 'historyProtocol'
>;

export function createInitialBrowserRouter(
  options: InitialBrowserRouterOptions,
): Promise<BrowserRouter>;

export interface ElementsRendererProps {
  elements: RenderArgsElements;
}

export type ElementsRenderer = React.ComponentType<ElementsRendererProps>;

export interface GetStoreRenderArgsOptions {
  store: Store;
  getFound?: (store: Store) => FoundState;
  matchContext: any;
  resolver: Resolver;
}

export function getStoreRenderArgs(
  options: GetStoreRenderArgsOptions,
): Promise<RenderArgs>;
