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
  var type = typeof input;

  // thunkify function
  if (type === 'function') {
    return thunkify(input, ctx);
  }

  if (input instanceof EventEmitter) {
    return eventToThunk(input, ctx);
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

/**
 * wrap a event object to a thunk
 * yield to wait the event emit `end`, `close`, `finish` or others
 * @param {Event} e
 * @param {Array} globalEvents
 * @return {Function}
 */
function eventToThunk(e, globalEvents) {
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
        e.removeListener('error', error);
        endEvents.forEach(function (name) {
          e.removeListener(name, end);
        });
        done(err, data);
      }

      function error(err) {
        if (called) {
          return;
        }
        called = true;
        done(err);
      }

      function end(data) {
        if (called) {
          return;
        }
        called = true;
        done(null, data);
      }

      e.once('error', error);
      endEvents.forEach(function (name) {
        e.once(name, end);
      });
    };
  };
}
