// Type definitions for found v0.3.5
// Project: https://github.com/4Catalyzer/found
// Definitions by: Kevin Ross <https://github.com/rosskevin/>

declare module 'found' {
  import * as React from 'react';

  interface ObjectMap {
    [key: string]: any;
  }

  interface ObjectStringMap {
    [key: string]: string;
  }

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
  interface Location {
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
    state: any;
  }

  interface MatchBase {
    /**
     * The current location
     */
    location: Location;
    /**
     * The union of path parameters for *all* matched routes
     */
    params: ObjectStringMap;
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
     * The base match, for symmetry with withRouter.
     */
    match: MatchBase;
    /**
     * An object with static router properties.
     */
    router: Router;
    /**
     * matchContext from the router
     */
    context: any;
  }

  /**
   * An object implementing the matching algorithm.
   *
   * User code generally shouldn't need this, but it doesn't hurt to here,
   * since we use it for routerShape below.
   */
  interface Matcher {
    match: Function;
    getRoutes: Function;
    isActive: Function;
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
    public push: (location: LocationDescriptor) => void;
    /**
     * Replace the current history entry
     * @see farce
     */
    public replace: (location: LocationDescriptor) => void;
    /**
     * Moves delta steps in the history stack
     * @see farce
     */
    public go: (delta: number) => void;

    public createHref: (location: LocationDescriptor) => string;
    public createLocation: (location: LocationDescriptor) => Location;
    /**
     * for match as above, returns whether match corresponds to location or a
     * subpath of location; if exact is set, returns whether match corresponds
     * exactly to location
     */
    public isActive: (
      match: Match,
      location: Location,
      options: { exact?: boolean },
    ) => boolean;
    public matcher: Matcher;
    /**
     * Adds a transition hook that can block navigation.
     *
     * This method takes a transition hook function and returns a function to
     * remove the transition hook.
     */
    public addTransitionHook: (hook: TransitionHook) => (() => void);
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
    routeParams: ObjectStringMap;
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
      | Array<React.ReactElement<RouteProps>>
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
    public status: number;
    public data: any;
    constructor(status: number);
  }

  interface RedirectProps {
    from: string;
    to: string;
  }

  class Redirect extends React.Component<RedirectProps> {}

  interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    Component?: React.ComponentType<any>;
    to: string | LocationDescriptor;
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
    public onClick: (event: React.SyntheticEvent<any>) => void;
  }

  interface WithRouter {
    match: Match;
    router: Router;
  }

  function withRouter<OriginalProps>(
    Component: React.ComponentType<OriginalProps & WithRouter>,
  ): React.ComponentType<OriginalProps>;

  class RedirectException {
    constructor(location: string | LocationDescriptor);
  }

  /**
   * Create a route configuration from JSX configuration elements.
   */
  function makeRouteConfig(node: React.ReactNode): RouteConfig;

  // Improve these `any`s as needed
  type BrowserRouter = any;

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
    renderPending?: (args: Match) => React.ReactElement<any>;
    renderReady?: (args: RenderReadyArgs) => React.ReactElement<any>;
    renderError?: (args: RenderErrorArgs) => React.ReactElement<any>;
  }

  interface CreateBrowserRouterArgs extends CreateRenderArgs {
    render?: (args: RouterRenderArgs) => React.ReactElement<any>;
    [key: string]: any;
  }

  function createBrowserRouter(
    options: CreateBrowserRouterArgs,
  ): BrowserRouter;

  // Improve these `any`s as needed
  type FarceRouter = any;

  function createFarceRouter({
    store,
    historyProtocol,
    historyMiddlewares,
    historyOptions,
    routeConfig,
    ...options
  }: any): FarceRouter;

  function createRender(args: CreateRenderArgs): React.ReactElement<any>;
}
