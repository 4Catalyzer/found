// TypeScript Version: 3.0

declare module 'found' {
  import * as React from 'react';
  import { Store, Reducer, Action, StoreEnhancer } from 'redux';

  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

  interface ObjectMap {
    [key: string]: any;
  }

  interface ObjectStringMap {
    [key: string]: string;
  }

  interface Location<S = any> {
    /**
     * 'PUSH' or 'REPLACE' if the location was reached via FarceActions.push or
     * FarceActions.replace respectively; 'POP' on the initial location, or if
     * the location was reached via the browser back or forward buttons or
     * via FarceActions.go
     */
    action: 'PUSH' | 'REPLACE' | 'POP';
    /**
     * the difference between the current index and the index of the previous
     * location
     */
    delta: number;
    /**
     * the location hash; as on window.location e.g. '#qux'
     */
    hash: string;
    /**
     * the current index of the history entry, starting at 0 for the initial
     * entry; this increments on FarceActions.push but not on
     * FarceActions.replace
     */
    index: number;
    /**
     * if present, a unique key identifying the current history entry
     */
    key?: string;
    /**
     * the path name; as on window.location e.g. '/foo'
     */
    pathname: string;
    /**
     * map version of search string
     */
    query: ObjectStringMap;
    /**
     * the search string; as on window.location e.g. '?bar=baz'
     */
    search: string;
    /**
     * additional location state that is not part of the URL
     */
    state: S;
  }

  type Params = ObjectStringMap;

  /**
   * Location descriptor string:
   *  store.dispatch(FarceActions.push('/foo?bar=baz#qux'));
   *
   * Equivalent location descriptor object:
   *    store.dispatch(FarceActions.push({
   *     pathname: '/foo',
   *     search: '?bar=baz',
   *     hash: '#qux',
   *   }));
   *
   * https://github.com/4Catalyzer/farce#locations-and-location-descriptors
   */

  interface MatchBase {
    /**
     * The current location
     */
    location: Location;
    /**
     * The union of path parameters for *all* matched routes
     */
    params: Params;
  }

  /**
   * The shape might be different with a custom matcher or history enhancer,
   * but the default matcher assumes and provides this shape. As such, this
   * validator is purely for user convenience and should not be used
   * internally.
   */
  interface Match extends MatchBase {
    /**
     * An array of all matched route objects
     */
    routes: RouteConfig[];
    /**
     * An object with static router properties.
     */
    router: Router;
    /**
     * matchContext from the router
     */
    context: any;
  }

  interface FoundState {
    match: Match;
    resolvedMatch: any;
  }

  interface Resolver {
    resolveElements(
      match: Match,
    ): AsyncIterableIterator<React.ReactElement<any> | null>;
  }

  const resolver: Resolver;

  const foundReducer: Reducer<FoundState>;

  /**
   * An object implementing the matching algorithm.
   *
   * User code generally shouldn't need this, but it doesn't hurt to here,
   * since we use it for routerShape below.
   */
  class Matcher {
    constructor(
      routeConfig: RouteConfig,
      options: { matchStemRoutes: boolean },
    );
    match(
      location: Location,
    ): null | { routeIndices: number[]; routeParams: Params; params: Params };
    getRoutes: () => RouteConfig[];
    isActive: (
      match: Match,
      location: Location,
      options: { exact: boolean },
    ) => boolean;
    /**
     * Returns the path string for a pattern of the same format as a route path
     * and a object of the corresponding path parameters
     */
    format: (pattern: any, params: ObjectMap) => any;
  }

  /**
   * Location descriptor object used in #push and #replace.
   */
  type LocationDescriptorObject = Pick<Location, 'pathname'> &
    Partial<Pick<Location, 'search' | 'hash' | 'state' | 'query'>>;

  type LocationDescriptor = LocationDescriptorObject | string;

  /**
   * The transition hook function receives the location to which the user is
   * attempting to navigate.
   *
   * This function may return:
   *  - true to allow the transition
   *  - false to block the transition
   *  - A string to prompt the user with that string as the message
   *  - A nully value to call the next transition hook and use its return
   *    value, if present, or else to allow the transition
   *  - A promise that resolves to any of the above values, to allow or block
   *    the transition once the promise resolves
   *
   * @see https://github.com/4Catalyzer/farce#transition-hooks
   */
  type TransitionHook = (
    location: Location,
  ) => undefined | (boolean | string | Promise<boolean | string>);

  class Router {
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

    createHref: (location: LocationDescriptor) => string;
    createLocation: (location: LocationDescriptor) => Location;
    /**
     * for match as above, returns whether match corresponds to location or a
     * subpath of location; if exact is set, returns whether match corresponds
     * exactly to location
     */
    isActive: (
      match: Match,
      location: Location,
      options: { exact?: boolean },
    ) => boolean;
    matcher: Matcher;
    /**
     * Adds a transition hook that can block navigation.
     *
     * This method takes a transition hook function and returns a function to
     * remove the transition hook.
     */
    addTransitionHook: (hook: TransitionHook) => (() => void);
  }

  /**
   * The match for a specific route, including that route and its own params.
   */
  interface RouteMatch extends Match {
    /**
     * The route object corresponding to this component
     */
    route: RouteConfig;
    /**
     * The path parameters for route
     */
    routeParams: Params;
  }

  interface RenderProps extends RouteMatch {
    /**
     * The data for the route, as above; null if the data have not yet been
     * loaded
     */
    data?: any;
  }

  /**
   * @see https://github.com/4Catalyzer/found/blob/master/README.md#render
   */
  interface RouteRenderArgs {
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

  /**
   * Shared properties between JSX Route and the resolved RouteConfig
   */
  interface BaseRouteConfig {
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
    ) =>
      | React.ComponentType<any>
      | Promise<React.ComponentType<any>>
      | Promise<JSX.Element>;
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
     *
     * @returns never (RedirectException) | undefined | React.ReactElement<any> (typical)
     */
    render?: (
      args: RouteRenderArgs,
    ) => never | undefined | React.ReactElement<any>;
    // Provide indexer allowing for any properties
    [key: string]: any;
  }

  interface RouteProps extends BaseRouteConfig {
    children?:
      | React.ReactNode
      | false
      | null
      | Array<false | null | React.ReactElement<RouteProps>>
      | React.ReactElement<RouteProps>;
  }

  /**
   * JSX Route
   */
  class Route extends React.Component<RouteProps> {}

  /**
   * e.g. Resolved JSX Route
   */
  interface RouteConfig extends BaseRouteConfig {
    children?: RouteConfig[];
  }

  class HttpError {
    status: number;
    data: any;
    constructor(status: number);
  }

  interface RedirectProps {
    from?: string;
    to: string | ((match: Match) => LocationDescriptor);
  }

  class Redirect extends React.Component<RedirectProps> {}

  interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    Component?: React.ComponentType<any>;
    to: LocationDescriptor;
    // match: Match,  provided by withRouter
    activeClassName?: string;
    activeStyle?: any;
    activePropName?: string;
    // router: Router, provided by withRouter
    exact?: boolean;
    target?: string;
    childProps?: any;
  }

  class Link extends React.Component<LinkProps> {
    onClick: (event: React.SyntheticEvent<any>) => void;
  }

  interface WithRouter {
    match: Match;
    router: Router;
  }

  function withRouter<Props extends WithRouter>(
    Component: React.ComponentType<Props>,
  ): React.ComponentType<Omit<Props, keyof WithRouter>>;

  class RedirectException {
    constructor(location: LocationDescriptor);
  }

  /**
   * Create a route configuration from JSX configuration elements.
   */
  function makeRouteConfig(node: React.ReactNode): RouteConfig;

  type ReactElementOrGroup =
    | React.ReactElement<any>
    | { [key: string]: ReactElementOrGroup[] };

  interface RenderErrorArgs extends Match {
    error: HttpError;
  }

  interface RenderReadyArgs extends Match {
    elements: ReactElementOrGroup[];
  }

  interface RouterRenderArgs extends Match {
    error?: HttpError;
    elements?: ReactElementOrGroup[];
  }

  interface CreateRenderArgs {
    renderPending?: (args: Match) => React.ReactNode;
    renderReady?: (args: RenderReadyArgs) => React.ReactNode;
    renderError?: (args: RenderErrorArgs) => React.ReactNode;
  }

  function createMatchEnhancer(
    matcher: Matcher,
  ): () => StoreEnhancer<{
    found: {
      matcher: Matcher;
      replaceRouteConfig: (routes: RouteConfig) => void;
    };
  }>;

  function createRender(
    args: CreateRenderArgs,
  ): (renderArgs: Match) => React.ReactElement<any>;

  interface BaseCreateRouterArgs extends CreateRenderArgs {
    render?: (args: RouterRenderArgs) => React.ReactNode;
  }

  interface CreateConnectedRouterArgs extends BaseCreateRouterArgs {
    getFound?: (store: any) => FoundState;
  }

  interface FarceCreateRouterArgs extends BaseCreateRouterArgs {
    store?: Store;
    historyProtocol: any;
    historyMiddlewares?: any[];
    historyOptions?: any;
    routeConfig: RouteConfig;
  }

  interface CreateBrowserRouterArgs
    extends Omit<FarceCreateRouterArgs, 'historyProtocol'> {
    render?: (args: RouterRenderArgs) => React.ReactNode;
  }

  // Improve these `any`s as needed
  type ConnectedRouter = React.ComponentType<{
    resolver: Resolver;
    matchContext?: any;
  }>;

  type BrowserRouter = React.ComponentType<{
    resolver?: Resolver;
    matchContext?: any;
  }>;

  function createConnectedRouter({
    getFound,
    ...opts
  }: CreateConnectedRouterArgs): ConnectedRouter;

  function createFarceRouter({
    store,
    historyProtocol,
    historyMiddlewares,
    historyOptions,
    routeConfig,
    ...options
  }: FarceCreateRouterArgs): ConnectedRouter;

  function createBrowserRouter(
    options: CreateBrowserRouterArgs,
  ): BrowserRouter;
}
