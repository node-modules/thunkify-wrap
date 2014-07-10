/**!
 * node-thunkify-wrap - index.js
 * MIT Licensed
 */

'use strict';
var EventEmitter = require('events').EventEmitter;

/**
 * Expose `thunkify()`.
 * @param {Function | Object} input
 * @param {Object} [ctx]
 * @param {Array}  [methods]
 * @return {Function}
 * @api public
 */

module.exports = function (input, ctx, methods) {
  return wrapify(input, ctx, methods, thunkify);
};

function wrapify(input, ctx, methods, wrapfn) {
  var type = typeof input;

  // thunkify function
  if (type === 'function') {
    return wrapfn(input, ctx);
  }

  // thunkify object
  if (type === 'object') {
    if (Array.isArray(ctx)) {
      methods = ctx;
      ctx = input;
    }

    if (typeof ctx === 'string') {
      methods = [ctx];
      ctx = input;
    }

    ctx = ctx === undefined ? input : ctx;
    if (methods && methods.length) {
      methods.forEach(function (method) {
        input[method] = wrapfn(input[method], ctx);
      });
    } else {
      // thunkify all methods in input
      for (var key in input) {
        if (typeof input[key] === 'function') {
          input[key] = wrapfn(input[key], ctx);
        }
      }
    }

    return input;
  }

  throw new TypeError('thunkify accept only `function` or `object`');
}

var slice = Array.prototype.slice;

/**
 * Wrap a regular callback `fn` as a thunk.
 *
 * @param {Function} fn
 * @param {Object} [ctx]
 * @return {Function}
 */

function thunkify(fn, ctx) {
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

/**
 * Wrap a regular callback `fn` as a `GeneratorFunction`.
 *
 * @param {Function} fn
 * @param {Object} [ctx]
 * @return {Function}
 */

function genify(fn, ctx) {
  if (fn.constructor.name === 'GeneratorFunction') {
    return fn;
  }
  function* genify() {
    var thunk = thunkify(fn);
    return yield thunk.apply(ctx || this, arguments);
  }
  return genify;
}

/**
 * wrap a event object to a thunk
 * yield to wait the event emit `end`, `close`, `finish` or others
 * @param {Event} e
 * @param {Array} globalEvents
 * @return {Function}
 */
module.exports.event = function (e, globalEvents) {
  globalEvents = globalEvents || ['end'];
  return function (endEvents) {
    var called = false;
    endEvents = endEvents || globalEvents;
    if (!Array.isArray(endEvents)) {
      endEvents = [endEvents];
    }
    return function (done) {
      // clean
      function _done(err, data) {
        if (called) {
          return;
        }
        called = true;
        e.removeListener('error', _done);
        endEvents.forEach(function (name) {
          e.removeListener(name, end);
        });
        done(err, data);
      }

      function end(data) {
        _done(null, data);
      }

      e.once('error', _done);
      endEvents.forEach(function (name) {
        e.once(name, end);
      });
    };
  };
};

/**
 * Expose `thunkify()`.
 * @param {Function | Object} input
 * @param {Object} [ctx]
 * @param {Array}  [methods]
 * @return {Function}
 * @api public
 */

module.exports.genify = function (input, ctx, methods) {
  return wrapify(input, ctx, methods, genify);
};
