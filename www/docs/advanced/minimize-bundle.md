---
sidebar_position: 7
---

# Minimizing bundle size

The top-level `found` package exports everything available in this library. It is unlikely that any single application will use all the features available. As such, for real applications, you should import the modules you need directly, to pull in only the code that you use.

```js
import createBrowserRouter from "found/createBrowserRouter";
import makeRouteConfig from "found/makeRouteConfig";
import { routerShape } from "found/PropTypes";
import Route from "found/Route";

// Instead of:
// import {
//  createBrowserRouter,
//  makeRouteConfig,
//  Route,
//  routerShape,
// } from 'found';
```

[build-badge]: https://img.shields.io/travis/4Catalyzer/found/master.svg
[build]: https://travis-ci.org/4Catalyzer/found
[npm-badge]: https://img.shields.io/npm/v/found.svg
[npm]: https://www.npmjs.org/package/found
