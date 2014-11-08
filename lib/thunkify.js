/*!
 * node-thunkify-wrap - lib/thunkify.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

var slice = Array.prototype.slice;

/**
 * Wrap a regular callback `fn` as a thunk.
 *
 * @param {Function} fn
 * @param {Object} [ctx]
 * @return {Function}
 */

module.exports = function thunkify(fn, ctx) {
    if (!fn) {
      return fn;
    }

  if (isGeneratorFunction(fn)) {
    return fn;
  }

  if (fn.toString() === thunk.toString()) {
    return fn;
  }
  function thunk() {
    var args = slice.call(arguments);
    var results;
    var called;
    var cb;

    args.push(function () {
      results = arguments;

      if (cb && !called) {
        called = true;
        cb.apply(this, results);
      }
    });

    fn.apply(ctx || this, args);

    return function (fn) {
      cb = fn;

      if (results && !called) {
        called = true;
        fn.apply(ctx || this, results);
      }
    };
  }
  return thunk;
}

function isGeneratorFunction(fn) {
  return typeof fn === 'function' && fn.constructor.name === 'GeneratorFunction';
}
