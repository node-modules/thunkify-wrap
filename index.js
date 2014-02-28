/**!
 * node-thunkify-wrap - index.js
 * MIT Licensed
 */

'use strict';

/**
 * Expose `thunkify()`.
 * @param {Function | Object} input
 * @param {Object} [ctx]
 * @param {Array}  [methods]
 * @return {Function}
 * @api public
 */

module.exports = function (input, ctx, methods) {
  var type = typeof input;

  // thunkify function
  if (type === 'function') {
    return thunkify(input, ctx);
  }

  // thunkify object
  if (type === 'object') {
    if (Array.isArray(ctx)) {
      methods = ctx;
      ctx = input;
    }
    ctx = ctx === undefined ? input : ctx;
    if (methods && methods.length) {
      methods.forEach(function (method) {
        input[method] = thunkify(input[method], ctx);
      });
    } else {
      // thunkify all methods in input
      for (var key in input) {
        if (typeof input[key] === 'function') {
          input[key] = thunkify(input[key], ctx);
        }
      }
    }

    return input;
  }

  throw new TypeError('thunkify accept only `function` or `object`');
};

/**
 * Wrap a regular callback `fn` as a thunk.
 *
 * @param {Function} fn
 * @param {Object} [ctx]
 * @return {Function}
 * @api public
 */

function thunkify(fn, ctx) {
  return function(){
    var args = [].slice.call(arguments);
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
  };
}
