/*!
 * thunkify-wrap - genify.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var thunkify = require('./thunkify');

/**
 * create a generator function warp
 * so you can use yield* every where
 *
 * @return {[type]} [description]
 */
module.exports = function genify(fn, ctx) {
  if (isGeneratorFunction(fn)) {
    return fn;
  }

  function* genify() {
    var thunk = thunkify(fn);
    return yield thunk.apply(ctx || this, arguments);
  }
  return genify;
};

function isGeneratorFunction(fn) {
  return typeof fn === 'function' && fn.constructor.name === 'GeneratorFunction';
}
