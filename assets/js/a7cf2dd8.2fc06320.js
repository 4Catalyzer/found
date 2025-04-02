"use strict";(self.webpackChunkfound_docs=self.webpackChunkfound_docs||[]).push([[1854],{735:(e,t,n)=>{n.d(t,{A:()=>l});var o=n(2785),s=n(9047),a=n(8532),r=n(1177),i=n(6540),d=n(4848);const c=e=>i.Children.toArray(e).reduce(((e,t)=>{if("pre"!==t.props.mdxType)return e;const{props:n}=t.props.children;let o,s=!1,a=!1;if(n.metastring){const[e,...t]=n.metastring.split(" ");o=`/${e}`,t.includes("hidden")&&(s=!0),t.includes("active")&&(a=!0)}else if("language-js"===n.className)o="/App.js";else if("language-ts"===n.className)o="/App.tsx";else if("language-tsx"===n.className)o="/App.tsx";else{if("language-css"!==n.className)throw new Error(`Code block is missing a filename: ${n.children}`);o="/styles.css"}if(e[o])throw new Error(`File ${o} was defined multiple times. Each file snippet should have a unique path name`);return e[o]={code:n.children,hidden:s,active:a},e}),{});function l(e){let{children:t,startRoute:n,dependencies:i={}}=e;const l=c(t),{colorMode:h}=(0,a.G)(),u=(0,r.A)();return(0,d.jsx)("div",{style:{"--prism-background-color":u.plain.backgroundColor,marginBottom:"2rem"},children:(0,d.jsx)(o.OZ,{template:"react-ts",files:l,theme:"dark"===h?s.f$:s.al,options:{startRoute:n,showNavigator:!0,editorHeight:400,editorWidthPercentage:60,externalResources:["https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap-reboot.min.css"]},customSetup:{dependencies:{...i,found:"*","memoize-one":"^6.0.0"}}})})}},830:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/route-match-d-0d19eb7e628b3495bf2cba46e0f83b00.png"},2068:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/route-ui-map-l-b08a6e4f684b10333935349a1a7699e2.png"},2403:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/wireframe-d-b4cc0e5c37767f15bd236573e6828cd5.png"},2409:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/route-graph-d-3f167ad375c7343107d8b8561637e556.png"},4118:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/route-match-l-ac500a2e4541c07d2045b856346069f9.png"},4298:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>c});const o=JSON.parse('{"id":"getting-started/how-it-works","title":"How it works","description":"A reasonably deep dive into how found does what it does.","source":"@site/docs/getting-started/how-it-works.mdx","sourceDirName":"getting-started","slug":"/getting-started/how-it-works","permalink":"/found/docs/getting-started/how-it-works","draft":false,"unlisted":false,"editUrl":"https://github.com/4Catalyzer/found/edit/master/www/docs/getting-started/how-it-works.mdx","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar","previous":{"title":"Quick start","permalink":"/found/docs/getting-started/quick-start"},"next":{"title":"Data fetching","permalink":"/found/docs/getting-started/data-fetching"}}');var s=n(4848),a=n(8453);n(735);const r={sidebar_position:1},i="How it works",d={},c=[{value:"An example",id:"an-example",level:2},{value:"Matching",id:"matching",level:2},{value:"Resolution",id:"resolution",level:2},{value:"Data fetching and code splitting",id:"data-fetching-and-code-splitting",level:3},{value:"Element construction",id:"element-construction",level:3},{value:"Loading states",id:"loading-states",level:2},{value:"Customizing",id:"customizing",level:2}];function l(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"how-it-works",children:"How it works"})}),"\n",(0,s.jsx)(t.p,{children:"A reasonably deep dive into how found does what it does."}),"\n",(0,s.jsx)(t.h2,{id:"an-example",children:"An example"}),"\n",(0,s.jsx)(t.p,{children:'Consider the following wireframe of a web app with side navigation\nand detail area. The user can navigate to sections (such as "products") and\nsee a list of products. Clicking further on a product navigates to a nested\ndetail view with tab navigation for that specific product.'}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"Product wireframe",src:n(7019).A+"#gh-light-mode-only",width:"1154",height:"507"}),"\n",(0,s.jsx)(t.img,{alt:"Product wireframe",src:n(2403).A+"#gh-dark-mode-only",width:"1154",height:"507"})]}),"\n",(0,s.jsx)(t.p,{children:"With Found we can represent this UI with the following route tree and config:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:'import { Route } from "found/jsx";\n\n<Route path="/" Component={AppPage}>\n  <Route path="customers">\n    <Route Component={CustomersIndexPage} />\n    <Route path=":customerId" Component={CustomerPage} />\n  </Route>\n\n  <Route path="products">\n    <Route Component={ProductsIndexPage} getData={fetchProducts} />\n    <Route path="create" Component={ProductCreatePage} />\n\n    <Route\n      path=":productId"\n      Component={ProductPage}\n      getData={fetchProduct}\n    >\n      <Route\n        path="edit"\n        Component={ProductEditPage}\n        getData={fetchProductById}\n      />\n      <Route\n        path="history"\n        Component={ProductHistoryPage}\n        getData={fetchProductHistory}\n      />\n    </Route>\n  </Route>\n\n  <Route path="settings" Component={SettingsPage} />\n</Route>;\n'})}),"\n",(0,s.jsx)(t.p,{children:"Which can also be illustrated via the following tree graph:"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"route-tree",src:n(9633).A+"#gh-light-mode-only",width:"913",height:"466"}),"\n",(0,s.jsx)(t.img,{alt:"route-tree",src:n(2409).A+"#gh-dark-mode-only",width:"913",height:"466"})]}),"\n",(0,s.jsxs)(t.p,{children:["Let's consider a single URL and break down how found determines what UI to show and when.\nIf we want to navigate to a Product's history page we would use the\nfollowing URL: ",(0,s.jsx)(t.code,{children:"/products/1/history"}),". Clicking on a ",(0,s.jsx)(t.code,{children:"<Link>"}),", calling\n",(0,s.jsx)(t.code,{children:"router.push('/products/1/history')"}),', or updating the browser URL bar triggers a new "match" resolution.']}),"\n",(0,s.jsx)(t.h2,{id:"matching",children:"Matching"}),"\n",(0,s.jsxs)(t.p,{children:["The first step in routing is to produce a ",(0,s.jsx)(t.code,{children:"match"}),". A match is created by a class called the ",(0,s.jsx)(t.code,{children:"Matcher"}),",\nwhich is generally an implementation detail of Found. Simply put, the Matcher takes a URL and produces a\nset of route objects that correspond to that URL."]}),"\n",(0,s.jsx)(t.p,{children:'This is accomplished by decomposing the URL into path segments and "matching" them with nodes in our route tree.\nIllustrated here is a match to our Product history page.'}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"route-match",src:n(4118).A+"#gh-light-mode-only",width:"913",height:"510"}),"\n",(0,s.jsx)(t.img,{alt:"route-match",src:n(830).A+"#gh-dark-mode-only",width:"913",height:"510"})]}),"\n",(0,s.jsx)(t.p,{children:"If the matcher is able to map the entire URL to a set of Routes, the matching succeeds and a\nmatch object is produced (simplified a bit here):"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"Match {\n  location: {\n    pathname: '/products/1/history',\n    query: {},\n    state: null,\n  },\n  params: { projectId: '1' },\n  routes: [\n    { path: '/', Component: AppPage, },\n    { path: 'products' },\n    { path: ':projectId', Component: ProductPage, getData: fetchProductById },\n    { path: 'history', Component: ProductHistoryPage, getData: fetchProductHistory },\n  ]\n}\n\n"})}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:['matching can only complete at "leaf" nodes in the route tree. This means that\nroutes that could be leaf or branch nodes (such as ',(0,s.jsx)(t.code,{children:"/products"}),') need to include an\n"index" route in order to match sucessfully. An index route is a route with a ',(0,s.jsx)(t.code,{children:"Component"}),"\nand no ",(0,s.jsx)(t.code,{children:"path"}),", as seen above in the route config."]})}),"\n",(0,s.jsx)(t.h2,{id:"resolution",children:"Resolution"}),"\n",(0,s.jsxs)(t.p,{children:['The next part in the process is "resolving". The router ',(0,s.jsx)(t.code,{children:"Resolver"})," is responsible for mapping the\nmatched routes to a set of React ",(0,s.jsx)(t.code,{children:"element"}),"s in order to render the UI for the URL.\nTo accomplish this it may need to fetch components or server data asynchronously, as specified by the route."]}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"resolver",src:n(5865).A+"#gh-light-mode-only",width:"980",height:"362"}),"\n",(0,s.jsx)(t.img,{alt:"resolver",src:n(4961).A+"#gh-dark-mode-only",width:"980",height:"362"})]}),"\n",(0,s.jsx)(t.h3,{id:"data-fetching-and-code-splitting",children:"Data fetching and code splitting"}),"\n",(0,s.jsxs)(t.p,{children:["Each route in the matched set may specify a ",(0,s.jsx)(t.code,{children:"getData"})," property to fetch data necessary to\nrender its ",(0,s.jsx)(t.code,{children:"Component"}),". The Resolver calls each and collects the returned ",(0,s.jsx)(t.code,{children:"Promise"}),"s which are\nall allowed to resolve in parallel--unless a route is ",(0,s.jsx)(t.code,{children:"deferred"}),", in which case the promises are split into batches\nbased on the route hierarchy."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:"const routeData = await Promise.all(\n  matchedRoutes.map((route: Route) => {\n    return route.getData ? route.getData(match) : undefined;\n  });\n)\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Similarly Route components can be asynchronously loaded by specifing ",(0,s.jsx)(t.code,{children:"getComponent"})," instead\nof ",(0,s.jsx)(t.code,{children:"Component"}),". Components are also loaded in parallel and awaited before resolving to a set of elements."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:"const routeComponents = await Promise.all(\n  matchedRoutes.map((route: Route) => {\n    return route.getComponent ? route.getComponent(match) : route.Component;\n  });\n)\n"})}),"\n",(0,s.jsx)(t.h3,{id:"element-construction",children:"Element construction"}),"\n",(0,s.jsx)(t.p,{children:"After data and components are resolved, each route is constructed into an element that will be rendered\nby the Router. Consider how our matched routes relate to the proposed UI:"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"route-ui-map",src:n(2068).A+"#gh-light-mode-only",width:"563",height:"531"}),"\n",(0,s.jsx)(t.img,{alt:"route-ui-map",src:n(4380).A+"#gh-dark-mode-only",width:"563",height:"531"})]}),"\n",(0,s.jsx)(t.p,{children:"Each route is ordered by its depth in the route tree and is responsible for\nrendering itself as well as any nested routes it may contain. Before we\ncan compose the UI together we need to construct its individual pieces.\nThis is done by combining our fetched components and data into elements:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:"const routeComponents = [\n  AppPage,\n  null,\n  ProductPage,\n  ProductHistoryPage,\n];\nconst routeData = [null, null, {}, {}];\n\nroutes.map((route, index) => {\n  const Component = routeComponents[index];\n  const data = routeData[index];\n\n  return Component ? <Component data={data} /> : null;\n});\n"})}),"\n",(0,s.jsx)(t.p,{children:"Finally this array is folded together by the Router into:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:"<AppPage>\n  <ProductPage>\n    <ProductHistoryPage />\n  </ProductPage>\n</AppPage>\n"})}),"\n",(0,s.jsx)(t.h2,{id:"loading-states",children:"Loading states"}),"\n",(0,s.jsxs)(t.p,{children:["One point that was glossed over is how routes can control their own loading UI\nwhile data and components are being fetched. To handle these states the ",(0,s.jsx)(t.code,{children:"Resolver"})," actually produces multiple\narrays of elements. While waiting for components and data to be fetched it calls each ",(0,s.jsx)(t.code,{children:"route.render"}),",\nwith the intermediary state. Once the async values are resolved each ",(0,s.jsx)(t.code,{children:"route.render"})," is called again\nwith the final values."]}),"\n",(0,s.jsxs)(t.p,{children:["This gives the route total control over how it handles loading fallbacks for itself and child routes. A Route\ncan explicitly render nothing (",(0,s.jsx)(t.code,{children:"null"}),"), a loading spinner, a skeleton UI, or whatever else it wants while\nit waits for data."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:'routes = [\n  // ...\n  {\n    path: ":productId",\n    getComponent: () =>\n      import("./components/ProductPage").then((m) => m.default),\n    getData: fetchProductById,\n    render({ props, Component }) {\n      // if Component is not present, it is still being fetched\n      if (!Component) {\n        return <Spinner />;\n      }\n\n      // props is the return value of `getData`\n      // If it\'s not present, data are still loading\n      if (!props) {\n        <Component showSkeleton />;\n      }\n\n      // Otherwise render the component with its props\n      return <Component {...props} />;\n    },\n  },\n];\n'})}),"\n",(0,s.jsx)(t.admonition,{type:"tip",children:(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"null"})," and ",(0,s.jsx)(t.code,{children:"undefined"})," mean different things as a return value of ",(0,s.jsx)(t.code,{children:"router.render"}),"!\nIf you return ",(0,s.jsx)(t.code,{children:"null"})," the router will render ",(0,s.jsx)(t.em,{children:"nothing"})," for that element, whereas ",(0,s.jsx)(t.code,{children:"undefined"}),'\nit treated as a special value that means "I can\'t render yet", which tells the router to continue\nto show the existing UI until the route is ready.']})}),"\n",(0,s.jsx)(t.p,{children:"This flexibility allows for easy implementation of many different loading UI patterns!"}),"\n",(0,s.jsx)(t.h2,{id:"customizing",children:"Customizing"}),"\n",(0,s.jsxs)(t.p,{children:["Nearly all of the behavior covered here is customizable and extensible, making found ideal\nfor all sorts of of React applications. Checkout our ",(0,s.jsx)(t.a,{href:"/found/docs/advanced/further-reading",children:"examples and extensions"})," for more ideas."]})]})}function h(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},4380:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/route-ui-map-d-0371d47fc2bde6d591913daf8c4cc202.png"},4961:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/resolver-d-71c630fa42737caa299f7dcc64788636.png"},5865:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/resolver-l-bd9447c82f1da3430fcc71ffc9efea2a.png"},7019:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/wireframe-l-d381e41711538dc8e91eae25b1cf74dc.png"},9633:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/route-graph-l-9e64d4bfec32926e42206a0d5a06ca11.png"}}]);