"use strict";(self.webpackChunkfound_docs=self.webpackChunkfound_docs||[]).push([[954],{3905:function(e,t,r){r.d(t,{Zo:function(){return d},kt:function(){return m}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},d=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),p=l(r),m=o,h=p["".concat(s,".").concat(m)]||p[m]||u[m]||a;return r?n.createElement(h,i(i({ref:t},d),{},{components:r})):n.createElement(h,i({ref:t},d))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=p;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var l=2;l<a;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},4705:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return d},default:function(){return p}});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),i=["components"],c={sidebar_position:2},s="Router configuration",l={unversionedId:"configuration/router-config",id:"configuration/router-config",title:"Router configuration",description:"Found exposes a number of router component class factories at varying levels of abstraction. These factories accept the static configuration properties for the router, such as the route configuration. The use of static configuration allows for efficient, parallel data fetching and state management as above.",source:"@site/docs/configuration/router-config.md",sourceDirName:"configuration",slug:"/configuration/router-config",permalink:"/found/configuration/router-config",editUrl:"https://github.com/4Catalyzer/found/edit/master/www/docs/configuration/router-config.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Route configuration",permalink:"/found/configuration/route-config"},next:{title:"Navigation",permalink:"/found/configuration/navigation"}},d=[{value:"<code>createBrowserRouter</code>",id:"createbrowserrouter",children:[],level:4},{value:"<code>createFarceRouter</code>",id:"createfarcerouter",children:[],level:4},{value:"<code>createConnectedRouter</code>",id:"createconnectedrouter",children:[],level:4}],u={toc:d};function p(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"router-configuration"},"Router configuration"),(0,a.kt)("p",null,"Found exposes a number of router component class factories at varying levels of abstraction. These factories accept the static configuration properties for the router, such as the route configuration. The use of static configuration allows for efficient, parallel data fetching and state management as above."),(0,a.kt)("h4",{id:"createbrowserrouter"},(0,a.kt)("inlineCode",{parentName:"h4"},"createBrowserRouter")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"createBrowserRouter")," creates a basic router component class that uses the HTML5 History API for navigation. This factory uses reasonable defaults that should fit a variety use cases."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import { createBrowserRouter } from 'found';\n\nconst BrowserRouter = createBrowserRouter({\n  routeConfig,\n\n  renderError: ({ error }) => (\n    <div>{error.status === 404 ? 'Not found' : 'Error'}</div>\n  ),\n});\n\nReactDOM.render(<BrowserRouter />, document.getElementById('root'));\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"createBrowserRouter")," takes an options object. The only mandatory property on this object is ",(0,a.kt)("inlineCode",{parentName:"p"},"routeConfig"),", which should be a route configuration as above."),(0,a.kt)("p",null,"The options object also accepts a number of optional properties:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"historyMiddlewares: Middleware[]")," - an array of ",(0,a.kt)("a",{parentName:"li",href:"https://github.com/4Catalyzer/farce#middlewares"},"Farce history middlewares"),"; by default, an array containing only ",(0,a.kt)("inlineCode",{parentName:"li"},"queryMiddleware")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"historyOptions: Omit<HistoryEnhancerOptions, 'protocol' | 'middlewares'>;")," - additional configuration options for the Farce history store enhancer"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"renderPending: (args: RenderPendingArgs) => React.ReactElement;"),": a custom render function called when some routes are not yet ready to render, due to those routes have unresolved asynchronous dependencies and no route-level ",(0,a.kt)("inlineCode",{parentName:"li"},"render")," method for handling the loading state"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"renderReady: (args: RenderPendingArgs) => React.ReactElement;"),": a custom render function called when all routes are ready to render"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"renderError: (args: RenderPendingArgs) => React.ReactElement;"),": a custom render function called if an ",(0,a.kt)("inlineCode",{parentName:"li"},"HttpError")," is thrown while resolving route elements")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="/types/index.d.ts"',title:'"/types/index.d.ts"'},"type RenderPendingArgs = Match;\ninterface Match<TContext = any> {\n  location: LocationDescriptor; // The current [location object](https://github.com/4Catalyzer/farce#locations-and-location-descriptors)\n  params: Params; // The union of path parameters for all matched routes\n  routes: RouteObject[]; // An array of all matched route objects\n  route: RouteObject; // The route object corresponding to this component\n  routeParams: Params[]; // The path parameters for `route`\n  routeIndices: RouteIndices;\n  context: TContext;\n}\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"render: (args: RenderArgs) => React.ReactElement;"),": a custom render function called in all cases, superseding ",(0,a.kt)("inlineCode",{parentName:"li"},"renderPending"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"renderReady"),", and ",(0,a.kt)("inlineCode",{parentName:"li"},"renderError"),"; by default, this is ",(0,a.kt)("inlineCode",{parentName:"li"},"createRender({ renderPending, renderReady, renderError }: CreateRenderOptions)"))),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"renderPending"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"renderReady"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"renderError"),", and ",(0,a.kt)("inlineCode",{parentName:"p"},"render")," functions receive the routing state object as an argument, with the following additional properties:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"elements: RenderArgsElements;"),": if present, an array the resolved elements for the matched routes; the array item will be ",(0,a.kt)("inlineCode",{parentName:"li"},"null")," for routes without elements"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"error: HttpError"),": if present, the ",(0,a.kt)("inlineCode",{parentName:"li"},"HttpError")," object thrown during element resolution with properties describing the error",(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"status: number"),": the status code; this is the first argument to the ",(0,a.kt)("inlineCode",{parentName:"li"},"HttpError")," constructor"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"data: any"),": additional error data; this is the second argument to the ",(0,a.kt)("inlineCode",{parentName:"li"},"HttpError")," constructor")))),(0,a.kt)("p",null,"You should specify a ",(0,a.kt)("inlineCode",{parentName:"p"},"renderError")," function or otherwise handle error states. You can specify ",(0,a.kt)("inlineCode",{parentName:"p"},"renderPending")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"renderReady")," functions to indicate loading state globally; the ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/4Catalyzer/found/tree/master/examples/global-pending"},"global pending state example")," demonstrates doing this using a static container."),(0,a.kt)("p",null,"The created ",(0,a.kt)("inlineCode",{parentName:"p"},"<BrowserRouter>")," accepts an optional ",(0,a.kt)("inlineCode",{parentName:"p"},"matchContext: any")," prop as described above that injects additional context into the route resolution methods."),(0,a.kt)("h4",{id:"createfarcerouter"},(0,a.kt)("inlineCode",{parentName:"h4"},"createFarceRouter")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"createFarceRouter")," exposes additional configuration for customizing navigation management and route element resolution. To enable minimizing bundle size, it omits some defaults from ",(0,a.kt)("inlineCode",{parentName:"p"},"createBrowserRouter"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import { BrowserProtocol, queryMiddleware } from 'farce';\nimport { createFarceRouter, resolver } from 'found';\n\nconst FarceRouter = createFarceRouter({\n  historyProtocol: new BrowserProtocol(),\n  historyMiddlewares: [queryMiddleware],\n  routeConfig,\n\n  renderError: ({ error }) => (\n    <div>{error.status === 404 ? 'Not found' : 'Error'}</div>\n  ),\n});\n\nReactDOM.render(\n  <FarceRouter resolver={resolver} />,\n  document.getElementById('root'),\n);\n")),(0,a.kt)("p",null,"The options object for ",(0,a.kt)("inlineCode",{parentName:"p"},"createFarceRouter")," should have a ",(0,a.kt)("inlineCode",{parentName:"p"},"historyProtocol")," property that has a history protocol object. For example, to use the HTML History API as with ",(0,a.kt)("inlineCode",{parentName:"p"},"createBrowserRouter"),", you would provide ",(0,a.kt)("inlineCode",{parentName:"p"},"new BrowserProtocol()"),"."),(0,a.kt)("p",null,"The created ",(0,a.kt)("inlineCode",{parentName:"p"},"<FarceRouter>")," manages setting up and providing a Redux store with the appropriate configuration internally. It also requires a ",(0,a.kt)("inlineCode",{parentName:"p"},"resolver")," prop with the route element resolver object. For routes configured as above, this should be the ",(0,a.kt)("inlineCode",{parentName:"p"},"resolver")," object in this library."),(0,a.kt)("h4",{id:"createconnectedrouter"},(0,a.kt)("inlineCode",{parentName:"h4"},"createConnectedRouter")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"createConnectedRouter")," creates a router that works with an existing Redux store and provider."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import {\n  Actions as FarceActions,\n  BrowserProtocol,\n  createHistoryEnhancer,\n  queryMiddleware,\n} from 'farce';\nimport {\n  createConnectedRouter,\n  createMatchEnhancer,\n  createRender,\n  foundReducer,\n  Matcher,\n  resolver,\n} from 'found';\nimport { Provider } from 'react-redux';\nimport { combineReducers, compose, createStore } from 'redux';\n\n/* ... */\n\nconst store = createStore(\n  combineReducers({\n    found: foundReducer,\n  }),\n  compose(\n    createHistoryEnhancer({\n      protocol: new BrowserProtocol(),\n      middlewares: [queryMiddleware],\n    }),\n    createMatchEnhancer(new Matcher(routeConfig)),\n  ),\n);\n\nstore.dispatch(FarceActions.init());\n\nconst ConnectedRouter = createConnectedRouter({\n  render: createRender({\n    renderError: ({ error }) => (\n      <div>{error.status === 404 ? 'Not found' : 'Error'}</div>\n    ),\n  }),\n});\n\nReactDOM.render(\n  <Provider store={store}>\n    <ConnectedRouter resolver={resolver} />\n  </Provider>,\n  document.getElementById('root'),\n);\n")),(0,a.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"Found uses ",(0,a.kt)("inlineCode",{parentName:"p"},"redux")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"react-redux")," as direct dependencies for the convenience of users not directly using Redux. If you are directly using Redux, either ensure that you have the same versions of ",(0,a.kt)("inlineCode",{parentName:"p"},"redux")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"react-redux")," installed as used in Found, or use package manager or bundler resolutions to force Found to use the same versions of those packages that you are using directly. Found is compatible with any current release of ",(0,a.kt)("inlineCode",{parentName:"p"},"redux")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"react-redux"),"."))),(0,a.kt)("p",null,"When creating a store for use with the created ",(0,a.kt)("inlineCode",{parentName:"p"},"<ConnectedRouter>"),", you should install the ",(0,a.kt)("inlineCode",{parentName:"p"},"foundReducer")," reducer under the ",(0,a.kt)("inlineCode",{parentName:"p"},"found")," key. You should also use a store enhancer created with ",(0,a.kt)("inlineCode",{parentName:"p"},"createHistoryEnhancer")," from Farce and a store enhancer created with ",(0,a.kt)("inlineCode",{parentName:"p"},"createMatchEnhancer"),", which must go after the history store enhancer. Dispatch ",(0,a.kt)("inlineCode",{parentName:"p"},"FarceActions.init()")," after setting up your store to initialize the event listeners and the initial location for the history store enhancer."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"createConnectedRouter")," ignores the ",(0,a.kt)("inlineCode",{parentName:"p"},"historyProtocol"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"historyMiddlewares"),", and ",(0,a.kt)("inlineCode",{parentName:"p"},"historyOptions")," properties on its options object."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"createConnectedRouter")," also accepts an optional ",(0,a.kt)("inlineCode",{parentName:"p"},"getFound")," property. If you installed ",(0,a.kt)("inlineCode",{parentName:"p"},"foundReducer")," on a key other than ",(0,a.kt)("inlineCode",{parentName:"p"},"found"),", specify the ",(0,a.kt)("inlineCode",{parentName:"p"},"getFound")," function to retrieve the reducer state."))}p.isMDXComponent=!0}}]);