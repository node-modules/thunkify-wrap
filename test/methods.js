
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
  });
});
