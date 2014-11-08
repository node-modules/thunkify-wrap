/**!
 * node-thunkify-wrap - lib/index.js
 * MIT Licensed
 */

'use strict';
var EventEmitter = require('events').EventEmitter;
var thunkify = require('./thunkify');
var event = require('./event');
var enable = require('enable');

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

module.exports.event = event;

if (enable.generator) {
  var genify = require('./genify');

   /**
   * Expose `genify()`.
   * @param {Function | Object} input
   * @param {Object} [ctx]
   * @param {Array}  [methods]
   * @return {Function}
   * @api public
   */

  module.exports.genify = function (input, ctx, methods) {
    return wrapify(input, ctx, methods, genify);
  };
}

/**
 * wrap a event object to a thunk
 * yield to wait the event emit `end`, `close`, `finish` or others
 * @param {Event} e
 * @param {Array} globalEvents
 * @return {Function}
 */

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
