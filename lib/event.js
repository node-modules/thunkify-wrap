/*!
 * thunkify-wrap - lib/thunkify.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

module.exports = function event(e, globalEvents) {
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
