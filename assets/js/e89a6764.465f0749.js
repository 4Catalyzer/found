"use strict";(self.webpackChunkfound_docs=self.webpackChunkfound_docs||[]).push([[658],{3905:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return f}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),d=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=d(e.components);return r.createElement(u.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=d(n),f=o,h=p["".concat(u,".").concat(f)]||p[f]||s[f]||a;return n?r.createElement(h,i(i({ref:t},l),{},{components:n})):r.createElement(h,i({ref:t},l))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=p;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var d=2;d<a;d++)i[d]=n[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},9909:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return d},toc:function(){return l},default:function(){return p}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],c={sidebar_position:9},u="Hot reloading",d={unversionedId:"advanced/hot-reloading",id:"advanced/hot-reloading",title:"Hot reloading",description:"When using hot reloading via React Hot Loader, mark your route configuration with hotRouteConfig to enable hot reloading for your route configuration as well.",source:"@site/docs/advanced/hot-reloading.md",sourceDirName:"advanced",slug:"/advanced/hot-reloading",permalink:"/found/advanced/hot-reloading",editUrl:"https://github.com/4Catalyzer/found/edit/master/www/docs/advanced/hot-reloading.md",tags:[],version:"current",sidebarPosition:9,frontMatter:{sidebar_position:9},sidebar:"tutorialSidebar",previous:{title:"Server-side rendering",permalink:"/found/advanced/server-side-rendering"},next:{title:"Examples and extensions",permalink:"/found/advanced/further-reading"}},l=[],s={toc:l};function p(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"hot-reloading"},"Hot reloading"),(0,a.kt)("p",null,"When using hot reloading via ",(0,a.kt)("a",{parentName:"p",href:"https://gaearon.github.io/react-hot-loader/"},"React Hot Loader"),", mark your route configuration with ",(0,a.kt)("inlineCode",{parentName:"p"},"hotRouteConfig")," to enable hot reloading for your route configuration as well."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"export default hotRouteConfig(routeConfig);\n")),(0,a.kt)("p",null,"This will replace the route configuration and rerun the match with the current location whenever the route configuration changes. As with React Hot Loader, this is safe to do unconditionally, as it will have no effect in production."),(0,a.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"Changes to route components also count as route configuration changes. If your routes have asynchronous data dependencies, ensure that the data are cached. Otherwise, the router will refetch data every time a route component changes."))),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"createMatchEnhancer")," takes an optional ",(0,a.kt)("inlineCode",{parentName:"p"},"getFound")," function as its second argument. If you installed ",(0,a.kt)("inlineCode",{parentName:"p"},"foundReducer")," on a key other than ",(0,a.kt)("inlineCode",{parentName:"p"},"found"),", specify the ",(0,a.kt)("inlineCode",{parentName:"p"},"getFound")," function to retrieve the reducer state to enable this hot reloading support."),(0,a.kt)("p",null,"You can also manually replace the route configuration and rerun the match by calling ",(0,a.kt)("inlineCode",{parentName:"p"},"found.replaceRouteConfig")," on a Found-enhanced store object."))}p.isMDXComponent=!0}}]);