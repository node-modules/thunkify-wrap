
thunkify-wrap
===========

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/thunkify-wrap.svg?style=flat-square
[npm-url]: https://npmjs.org/package/thunkify-wrap
[travis-image]: https://img.shields.io/travis/node-modules/thunkify-wrap.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/thunkify-wrap
[coveralls-image]: https://img.shields.io/coveralls/node-modules/thunkify-wrap.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/node-modules/thunkify-wrap?branch=master
[gittip-image]: https://img.shields.io/gittip/dead-horse.svg?style=flat-square
[gittip-url]: https://www.gittip.com/dead-horse/
[david-image]: https://img.shields.io/david/node-modules/thunkify-wrap.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/thunkify-wrap
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/thunkify-wrap.svg?style=flat-square
[download-url]: https://npmjs.org/package/thunkify-wrap

  Turn each node function in an object return a thunk.
  Turn a regular node function into one which returns a thunk,
  useful for generator-based flow control such as [co](https://github.com/visionmedia/co).

## Installation

```sh
npm install thunkify-wrap --save
```

## Example

```js
// the same as thunkify
var thunkify = require('thunkify-wrap');
var fs = require('fs');

fs.readFile = thunkify(fs.readFile);

fs.readFile('package.json', 'utf8')(function(err, str){

});

// thunkfiy an object
var user = {
  add: function () {},
  show: function () {},
  list: function () {}
}

module.exports = thunkify(user);
// module.exports = thunkify(user, ['add', 'show']);
// module.exports = thunkify(user, 'add');
```

## genify

Wrap every function return a `GeneratorFunction`,
that will be easy to write codes in only one way: `yield* fn()`.

```js
var genify = require('thunkify-wrap').genify;
var fs = require('fs');

fs.readFile = genify(fs.readFile);

var content = yield* fs.readFile(__filename, 'utf8');
```

## event support

you can pass an event object, give end event name list, wrap event to thunk like this

```
var e = new EventEmitter();
var end = thunkify.event(e, 'finish');

yield end();
or
yield.end(['close', 'end']); // will cover `finish` event
```

when specified events emitted, this generator will go on. see more in the source code.

## ctx

also you can pass `ctx` as contenxt into thunkify, and `thunkify(object)` will use object as the context by default.

```js
var thunkify = require('thunkify-wrap');
var Cal = function (a, b) {
  this.a = a;
  this.b = b;
};

Cal.prototype.plus = function(callback) {
  var self = this;
  setTimeout(function () {
    callback(null, self.a + self.b);
  }, 5);
};

Cal.prototype.minus = function (callback) {
  var self = this;
  setTimeout(function () {
    callback(null, self.a - self.b);
  }, 5);
};

module.exports = Cal;

exports.create1 = function (a, b) {
  return thunkify(new Cal(a, b));
};

// or
exports.create2 = function (a, b) {
  var cal = new Cal(a, b);
  cal.plus = thunkify(cal.plus, cal);
  cal.minus = thunkify(cal.minus, cal);
};
```

### methods

by pass `methods` list, support only thunkify a part of methods in an object.

```
exports.create3 = function (a, b) {
  var cal = new Cal(a, b);
  thunkify(cal, cal, ['plus']);
  // or
  thunkify(cal, ['plus']);
};
```

# License

  MIT
