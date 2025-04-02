"use strict";(self.webpackChunkfound_docs=self.webpackChunkfound_docs||[]).push([[2472],{5566:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>i});const o=JSON.parse('{"id":"advanced/component-route-access","title":"Accessing route matches in components","description":"To access details of the current route match, Found injects { router, match } props","source":"@site/docs/advanced/component-route-access.md","sourceDirName":"advanced","slug":"/advanced/component-route-access","permalink":"/found/docs/advanced/component-route-access","draft":false,"unlisted":false,"editUrl":"https://github.com/4Catalyzer/found/edit/master/www/docs/advanced/component-route-access.md","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar","previous":{"title":"Advanced","permalink":"/found/docs/category/advanced"},"next":{"title":"Error handling","permalink":"/found/docs/advanced/error-handling"}}');var c=t(4848),s=t(8453);const r={sidebar_position:1},a="Accessing route matches in components",d={},i=[];function u(e){const n={code:"code",h1:"h1",header:"header",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n.header,{children:(0,c.jsx)(n.h1,{id:"accessing-route-matches-in-components",children:"Accessing route matches in components"})}),"\n",(0,c.jsxs)(n.p,{children:["To access details of the current route match, Found injects ",(0,c.jsx)(n.code,{children:"{ router, match }"})," props\ninto every route ",(0,c.jsx)(n.code,{children:"Component"})," that matches for a URL. Sometimes it's not convenient to pass these\ndown deeper into your component tree. To avoid this, Found provides a set of hooks for accessing\nthe route match state."]}),"\n",(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.code,{children:"useRouter"})," can be used to access both the current match and Router instance:"]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-js",children:'function MyButton() {\n  const { match, router } = useRouter();\n\n  const onClick = useCallback(() => {\n    router.replace("/widgets");\n  }, [router]);\n\n  return (\n    <button onClick={onClick}>\n      Current widget: {match.params.widgetId}\n    </button>\n  );\n}\n'})}),"\n",(0,c.jsxs)(n.p,{children:["Route ",(0,c.jsx)(n.code,{children:"match"})," contains the current route params, location, as well as matched route configs.\nThere are also ",(0,c.jsx)(n.code,{children:"useMatch"}),", ",(0,c.jsx)(n.code,{children:"useParams"})," and ",(0,c.jsx)(n.code,{children:"useLocation"})," for retrieving only what you specifically\nneed."]})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(u,{...e})}):u(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>a});var o=t(6540);const c={},s=o.createContext(c);function r(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:r(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);