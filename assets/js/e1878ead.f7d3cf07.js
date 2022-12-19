"use strict";(self.webpackChunkfound_docs=self.webpackChunkfound_docs||[]).push([[295],{3905:(e,n,t)=>{t.d(n,{Zo:()=>d,kt:()=>m});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var u=r.createContext({}),c=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},d=function(e){var n=c(e.components);return r.createElement(u.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),p=c(t),m=o,f=p["".concat(u,".").concat(m)]||p[m]||s[m]||i;return t?r.createElement(f,a(a({ref:n},d),{},{components:t})):r.createElement(f,a({ref:n},d))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,a=new Array(i);a[0]=p;var l={};for(var u in n)hasOwnProperty.call(n,u)&&(l[u]=n[u]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var c=2;c<i;c++)a[c]=t[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},7449:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>a,default:()=>s,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var r=t(7462),o=(t(7294),t(3905));const i={sidebar_position:7},a="Minimizing bundle size",l={unversionedId:"advanced/minimize-bundle",id:"advanced/minimize-bundle",title:"Minimizing bundle size",description:"The top-level found package exports everything available in this library. It is unlikely that any single application will use all the features available. As such, for real applications, you should import the modules you need directly, to pull in only the code that you use.",source:"@site/docs/advanced/minimize-bundle.md",sourceDirName:"advanced",slug:"/advanced/minimize-bundle",permalink:"/found/docs/advanced/minimize-bundle",draft:!1,editUrl:"https://github.com/4Catalyzer/found/edit/master/www/docs/advanced/minimize-bundle.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"tutorialSidebar",previous:{title:"Redux integration",permalink:"/found/docs/advanced/redux-integration"},next:{title:"Server-side rendering",permalink:"/found/docs/advanced/server-side-rendering"}},u={},c=[],d={toc:c};function s(e){let{components:n,...t}=e;return(0,o.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"minimizing-bundle-size"},"Minimizing bundle size"),(0,o.kt)("p",null,"The top-level ",(0,o.kt)("inlineCode",{parentName:"p"},"found")," package exports everything available in this library. It is unlikely that any single application will use all the features available. As such, for real applications, you should import the modules you need directly, to pull in only the code that you use."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'import createBrowserRouter from "found/createBrowserRouter";\nimport makeRouteConfig from "found/makeRouteConfig";\nimport { routerShape } from "found/PropTypes";\nimport Route from "found/Route";\n\n// Instead of:\n// import {\n//  createBrowserRouter,\n//  makeRouteConfig,\n//  Route,\n//  routerShape,\n// } from \'found\';\n')))}s.isMDXComponent=!0}}]);