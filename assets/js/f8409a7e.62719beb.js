"use strict";(self.webpackChunkfound_docs=self.webpackChunkfound_docs||[]).push([[206],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return g}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var d=r.createContext({}),u=function(e){var t=r.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},s=function(e){var t=u(e.components);return r.createElement(d.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,d=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),c=u(n),g=o,m=c["".concat(d,".").concat(g)]||c[g]||p[g]||i;return n?r.createElement(m,a(a({ref:t},s),{},{components:n})):r.createElement(m,a({ref:t},s))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=c;var l={};for(var d in t)hasOwnProperty.call(t,d)&&(l[d]=t[d]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var u=2;u<i;u++)a[u]=n[u];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},9568:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return d},metadata:function(){return u},toc:function(){return s},default:function(){return c}});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),a=["components"],l={sidebar_position:1,sidebar_label:"Introduction",slug:"/",title:"Introduction",hide_title:!0},d=void 0,u={unversionedId:"intro",id:"intro",title:"Introduction",description:"Found",source:"@site/docs/intro.mdx",sourceDirName:".",slug:"/",permalink:"/found/",editUrl:"https://github.com/4Catalyzer/found/edit/master/www/docs/intro.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,sidebar_label:"Introduction",slug:"/",title:"Introduction",hide_title:!0},sidebar:"tutorialSidebar",next:{title:"Installation",permalink:"/found/getting-started/installation"}},s=[{value:"Introduction",id:"introduction",children:[],level:2},{value:"Basic usage",id:"basic-usage",children:[],level:2}],p={toc:s};function c(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("div",{align:"center"},(0,i.kt)("img",{src:"https://4Catalyzer.github.io/found/img/f-logo-empty.svg",width:"200"}),(0,i.kt)("h1",null,"Found"),(0,i.kt)("p",null,"Extensible route-based routing for React applications."),(0,i.kt)("br",null)),(0,i.kt)("h2",{id:"introduction"},"Introduction"),(0,i.kt)("p",null,"Found is a router for ",(0,i.kt)("a",{parentName:"p",href:"https://reactjs.org/"},"React")," applications with a focus on power and extensibility. Found uses static route configurations. This enables efficient code splitting and data fetching with nested routes. Found also offers extensive control over indicating those loading states, even for routes with code bundles that have not yet been downloaded."),(0,i.kt)("p",null,"Found is designed to be extremely customizable. Most pieces of Found such as the path matching algorithm and the route element resolution can be fully replaced. This allows ",(0,i.kt)("a",{parentName:"p",href:"/advanced/further-reading"},"extensions")," such as ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/4Catalyzer/found-relay"},"Found Relay")," to provide first-class support for different use cases."),(0,i.kt)("p",null,"Found uses ",(0,i.kt)("a",{parentName:"p",href:"https://redux.js.org/"},"Redux")," for state management and ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/4Catalyzer/farce"},"Farce")," for controlling browser navigation. It can integrate with your existing store and connected components."),(0,i.kt)("h2",{id:"basic-usage"},"Basic usage"),(0,i.kt)("p",null,"The following route configuration"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},'const BrowserRouter = createBrowserRouter({\n  routeConfig: makeRouteConfig(\n    <Route path="/" Component={AppPage}>\n      <Route Component={MainPage} />\n      <Route path="widgets">\n        <Route Component={WidgetsPage} getData={fetchWidgets} />\n        <Route\n          path=":widgetId"\n          getComponent={() =>\n            System.import(\'./WidgetPage\').then((module) => module.default)\n          }\n          getData={({ params: { widgetId } }: RouteMatch) =>\n            fetchWidget(widgetId).catch(() => {\n              throw new HttpError(404);\n            })\n          }\n          render={({ Component, props }: RenderArgs) =>\n            Component && props ? (\n              <Component {...props} />\n            ) : (\n              <div>\n                <small>Loading</small>\n              </div>\n            )\n          }\n        />\n      </Route>\n      <Redirect from="widget/:widgetId" to="/widgets/:widgetId" />\n    </Route>,\n  ),\n\n  renderError: ({ error }: RenderErrorArgs) => (\n    <div>{error.status === 404 ? \'Not found\' : \'Error\'}</div>\n  ),\n});\n\nReactDOM.render(<BrowserRouter />, document.getElementById(\'root\'));\n')),(0,i.kt)("p",null,"will set up the following routes:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"This renders ",(0,i.kt)("inlineCode",{parentName:"li"},"<AppPage><MainPage /></AppPage>")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/widget"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"This renders ",(0,i.kt)("inlineCode",{parentName:"li"},"<AppPage><WidgetsPage /><AppPage>")),(0,i.kt)("li",{parentName:"ul"},"This will load the data for ",(0,i.kt)("inlineCode",{parentName:"li"},"<WidgetsPage>")," when the user navigates to this route"),(0,i.kt)("li",{parentName:"ul"},"This will continue to render the previous routes while the data for ",(0,i.kt)("inlineCode",{parentName:"li"},"<WidgetsPage>")," are loading"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/widgets/${widgetId}")," (e.g. ",(0,i.kt)("inlineCode",{parentName:"li"},"/widgets/foo"),")",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"This renders ",(0,i.kt)("inlineCode",{parentName:"li"},"<AppPage><WidgetPage /></AppPage>")),(0,i.kt)("li",{parentName:"ul"},"This will load the code and data for ",(0,i.kt)("inlineCode",{parentName:"li"},"<WidgetPage>")," when the user navigates to this route"),(0,i.kt)("li",{parentName:"ul"},'This will render the text "Loading" in place of ',(0,i.kt)("inlineCode",{parentName:"li"},"<WidgetPage>")," while the code and data for ",(0,i.kt)("inlineCode",{parentName:"li"},"<WidgetPage>")," are loading"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/widget/${widgetId}")," (e.g. ",(0,i.kt)("inlineCode",{parentName:"li"},"/widget/foo"),")",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"This redirects to ",(0,i.kt)("inlineCode",{parentName:"li"},"/widgets/${widgetId}"),", then renders as above")))))}c.isMDXComponent=!0}}]);