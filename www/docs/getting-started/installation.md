---
sidebar_position: 1
---

# Installation

Using npm:
```
$ npm i --save found
```
or yarn:
```
$ yarn add found
```

`found` depends on the relatively new async iterators proposal, which requires a **polyfill** of
`Symbol.asyncIterator` for older browsers. Core-js provides one if needed, import **before**
importing found

```js
import 'core-js/es/symbol/async-iterator';
```
