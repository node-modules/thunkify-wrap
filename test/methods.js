'use strict';

var assert = require('assert');
var thunkify = require('..');
var Cal = require('./support/cal');

describe('methods', function () {
  describe('thunkify(object) with ctx', function () {
    it('should work ok', function (done) {
      var cal2 = new Cal(2, 1);
      cal2 = thunkify(cal2, ['plus']);
      cal2.plus()(function (err, res) {
        assert(res === 3);
        assert(!cal2.minus(function () {}));
        done();
      });
    });

    it('should ignore not exist method ok', function (done) {
      var cal2 = new Cal(2, 1);
      cal2 = thunkify(cal2, ['plus', 'not-exist']);
      cal2.plus()(function (err, res) {
        assert(res === 3);
        assert(!cal2.minus(function () {}));
        done();
      });
    });
  });

  describe('thunkify.genify(object) with ctx', function () {
    it('should work ok', function* () {
      var cal2 = new Cal(2, 1);
      cal2 = thunkify.genify(cal2, ['plus']);
      assert((yield* cal2.plus()) === 3);
      assert(!cal2.minus(function () {}));
    });
  });
});
