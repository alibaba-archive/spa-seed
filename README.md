SPA Seed
====
Simple page application seed for teambition.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Talk topic][talk-image]][talk-url]

本项目主要作为 Simple page application 项目模板，也是 Toa 示例项目，主要提供如下功能：

1. 作为开发环境，提供 view 和静态资源驱动服务；
2. 为前端内容提供打包服务；
3. 提供了简单的 API 接口，可以很方便的改成 mock API；

本项目只是一个模板项目，你只需要复制本项目，然后根据需求修改成自己的项目即可。

本项目基于 [Toa](https://github.com/toajs/toa) 和 [thunks](https://github.com/thunks/thunks)。前者类似 [koa](https://github.com/koajs/koa)，是一个先进的 node.js server 框架。后者是一个小巧强大的异步流程控制工具，支持 promise、thunk 和 generator，并且对浏览器端全兼容。

实际上，如果你熟悉了 Toa，那么可以基于本项目开发完整的 web 服务，如博客、API server 等。

## usage

**development:**

```bash
npm install
bower install
gulp
npm start
```

访问：[http://localhost:3000](http://localhost:3000)

**build:**

```bash
npm install
bower install
gulp build
```

[npm-url]: https://npmjs.org/package/spa-seed
[npm-image]: http://img.shields.io/npm/v/spa-seed.svg

[travis-url]: https://travis-ci.org/teambition/spa-seed
[travis-image]: http://img.shields.io/travis/teambition/spa-seed.svg

[talk-url]: https://guest.talk.ai/rooms/a6a9331024
[talk-image]: https://img.shields.io/talk/t/a6a9331024.svg
