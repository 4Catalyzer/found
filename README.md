<div align="center">
<img src="https://golota60.github.io/found/img/f-logo-empty.svg" width="200">

<h1>Found</h1>
<p>
  Extensible route-based routing for React applications.
</p>
<br>

</div>

[![Travis][build-badge]][build] [![npm][npm-badge]][npm]

Found is a router for [React](https://reactjs.org/) applications with a focus on power and extensibility. Found uses static route configurations. This enables efficient code splitting and data fetching with nested routes. Found also offers extensive control over indicating those loading states, even for routes with code bundles that have not yet been downloaded.

Found is designed to be extremely customizable. Most pieces of Found such as the path matching algorithm and the route element resolution can be fully replaced. This allows [extensions](#extensions) such as [Found Relay](https://github.com/4Catalyzer/found-relay) to provide first-class support for different use cases.

Found uses [Redux](https://redux.js.org/) for state management and [Farce](https://github.com/4Catalyzer/farce) for controlling browser navigation. It can integrate with your existing store and connected components.

[build-badge]: https://img.shields.io/travis/4Catalyzer/found/master.svg
[build]: https://travis-ci.org/4Catalyzer/found
[npm-badge]: https://img.shields.io/npm/v/found.svg
[npm]: https://www.npmjs.org/package/found
