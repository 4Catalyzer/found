"use strict";(self.webpackChunkfound_docs=self.webpackChunkfound_docs||[]).push([[938],{5768:(t,e,n)=>{n.d(e,{Z:()=>p});var s=n(2488),o=n(3808),a=n(2949),r=n(6412),i=n(7294);function p(t){let{children:e,startRoute:n,dependencies:p={}}=t;const d=(t=>i.Children.toArray(t).reduce(((t,e)=>{if("pre"!==e.props.mdxType)return t;const{props:n}=e.props.children;let s,o=!1,a=!1;if(n.metastring){const[t,...e]=n.metastring.split(" ");s=`/${t}`,e.includes("hidden")&&(o=!0),e.includes("active")&&(a=!0)}else if("language-js"===n.className)s="/App.js";else if("language-ts"===n.className)s="/App.tsx";else if("language-tsx"===n.className)s="/App.tsx";else{if("language-css"!==n.className)throw new Error(`Code block is missing a filename: ${n.children}`);s="/styles.css"}if(t[s])throw new Error(`File ${s} was defined multiple times. Each file snippet should have a unique path name`);return t[s]={code:n.children,hidden:o,active:a},t}),{}))(e),{colorMode:c}=(0,a.I)(),l=(0,r.p)();return i.createElement("div",{style:{"--prism-background-color":l.plain.backgroundColor,marginBottom:"2rem"}},i.createElement(s.xR,{template:"react-ts",files:d,theme:"dark"===c?o.cL:o.A1,options:{startRoute:n,showNavigator:!0,editorHeight:400,editorWidthPercentage:60,externalResources:["https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap-reboot.min.css"]},customSetup:{dependencies:{...p,found:"*"}}}))}},4239:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>d,contentTitle:()=>i,default:()=>g,frontMatter:()=>r,metadata:()=>p,toc:()=>c});var s=n(7462),o=(n(7294),n(3905)),a=n(5768);const r={id:"data-fetching",sidebar_position:2},i="Data fetching",p={unversionedId:"getting-started/data-fetching",id:"getting-started/data-fetching",title:"Data fetching",description:"One of the most powerful aspects of found is it's built in support",source:"@site/docs/getting-started/data-fetching.mdx",sourceDirName:"getting-started",slug:"/getting-started/data-fetching",permalink:"/found/docs/getting-started/data-fetching",draft:!1,editUrl:"https://github.com/4Catalyzer/found/edit/master/www/docs/getting-started/data-fetching.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"data-fetching",sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"How it works",permalink:"/found/docs/getting-started/how-it-works"},next:{title:"Configuration",permalink:"/found/docs/category/configuration"}},d={},c=[],l={toc:c};function g(t){let{components:e,...n}=t;return(0,o.kt)("wrapper",(0,s.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"data-fetching"},"Data fetching"),(0,o.kt)("p",null,"One of the most powerful aspects of found is it's built in support\nfor efficient data fetching. Routes, can specify ",(0,o.kt)("inlineCode",{parentName:"p"},"getData")," functions\nto fetch from API's or other sources."),(0,o.kt)(a.Z,{startRoute:"/posts/1/",mdxType:"SandpackEditor"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'import "./styles.css";\n\nimport { createBrowserRouter, HttpError } from "found";\nimport PostsPage from "./PostsPage";\nimport PostPage from "./PostPage";\n\nconst API = "https://dummyjson.com";\n\nconst Router = createBrowserRouter({\n  routeConfig: [\n    {\n      path: "posts",\n      getData: async () => {\n        const resp = await fetch(`${API}/posts`);\n\n        if (!resp.ok) throw new HttpError(404);\n        return resp.json();\n      },\n      Component: PostsPage,\n      children: [\n        {\n          path: "/:postId",\n          getData: async ({ params }) => {\n            const resp = await fetch(\n              `${API}/posts/${params.postId}/`\n            );\n\n            if (!resp.ok) throw new HttpError(404);\n            return resp.json();\n          },\n          Component: PostPage,\n        },\n      ],\n    },\n  ],\n});\n\nexport default function App() {\n  return <Router />;\n}\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx",metastring:"PostsPage.tsx","PostsPage.tsx":!0},'import { Link, RouteComponentDataProps } from "found";\nimport type { Post } from "./PostPage.tsx";\n\nexport default function PostsPage({\n  data,\n  children,\n}: RouteComponentDataProps<{ posts: Post[] }>) {\n  return (\n    <div className="posts">\n      <nav className="posts--nav">\n        {data?.posts.map((post) => (\n          <Link key={post.id} to={`/posts/${post.id}`}>\n            {post.title}\n          </Link>\n        ))}\n      </nav>\n      <section>{children}</section>\n    </div>\n  );\n}\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx",metastring:"PostPage.tsx","PostPage.tsx":!0},'import type { RouteComponentDataProps } from "found";\n\nexport interface Post {\n  id: string;\n  title: string;\n  body: string;\n}\n\nexport default function PostPage({\n  data: post,\n  children,\n}: RouteComponentDataProps<Post>) {\n  return (\n    <div>\n      <h2>{post.title}</h2>\n      <p>{post.body}</p>\n\n      <section>{children}</section>\n    </div>\n  );\n}\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-css",metastring:"styles.css","styles.css":!0},".posts {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);\n  grid-gap: 1rem;\n}\n\n.posts--nav {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n\n.posts--nav > a {\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n"))),(0,o.kt)("p",null,'Above is a simple "List, detail" view of imaginary blog posts. Along the side is a list of\nof posts and clicking on any navigates to the "detail" view of the post.\nEven though these routes are nested, data is fetched in ',(0,o.kt)("strong",{parentName:"p"},"parallel"),". ",(0,o.kt)("inlineCode",{parentName:"p"},"/posts")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"/posts/1")," are triggered\ntogether and the UI waits for both to complete before rendering."))}g.isMDXComponent=!0}}]);