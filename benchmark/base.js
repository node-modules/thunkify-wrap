/**!
 * node-thunkify-wrap - benchmark/base.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var co = require('co');
var thunkify = require('../');

function async(foo, bar, callback) {
  setImmediate(function () {
    callback(null, {foo: foo, bar: bar});
  });
}

var n = 1000000;

var asyncThunk = thunkify(async);
var asyncGen = thunkify.genify(async);

console.log('\n  thunkify benchmark\n  node version: %s, date: %s\n  Starting...\n',
    process.version, Date());

co(function* () {
  var start = Date.now();
  for (var i = 0; i < n; i++) {
    yield asyncThunk('a', 1);
  }
  var use = Date.now() - start;
  console.log("  yield asyncThunk('a', 1) %d times, use: %sms, qps: %s", n, use, n / use * 1000);

  var start = Date.now();
  for (var i = 0; i < n; i++) {
    yield asyncGen('a', 1);
  }
  var use = Date.now() - start;
  console.log("  yield asyncGen('a', 1) %d times, use: %sms, qps: %s", n, use, n / use * 1000);

  var start = Date.now();
  for (var i = 0; i < n; i++) {
    yield* asyncGen('a', 1);
  }
  var use = Date.now() - start;
  console.log("  yield* asyncGen('a', 1) %d times, use: %sms, qps: %s", n, use, n / use * 1000);
})();

// $ node --harmony benchmark/base.js
//
//   thunkify benchmark
//   node version: v0.11.12, date: Thu Jul 10 2014 18:28:27 GMT+0800 (CST)
//   Starting...
//
//   yield asyncThunk('a', 1) 1000000 times, use: 5976ms, qps: 167336.01070950468
//   yield asyncGen('a', 1) 1000000 times, use: 15607ms, qps: 64073.81303261357
//   yield* asyncGen('a', 1) 1000000 times, use: 9456ms, qps: 105752.96108291032
