/**!
 * node-thunkify-wrap - index.js
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var thunkify = require('thunkify');

/**
 * Expose `thunkify()`.
 */

module.exports = function (input) {
  var type = typeof input;
  if (type === 'function') {
    return thunkify(input);
  }

  if (type === 'object') {
    for (var key in input) {
      if (typeof input[key] === 'function') {
        input[key] = thunkify(input[key]);
      }
    }
    return;
  }

  throw new TypeError('thunkify accept only `function` or `object`');
};
