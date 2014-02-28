
var co = require('co');
var assert = require('assert');
var thunkify = require('..');
var Cal = require('./support/cal');

describe('ctx', function () {
  describe('thunkify(fun) with ctx', function () {
    it('should work ok', function (done) {
      var cal1 = new Cal(3, 1);
      cal1.plus = thunkify(cal1.plus, cal1);
      cal1.minus = thunkify(cal1.minus, cal1);
      co(function *() {
        assert((yield cal1.plus) === 4);
        assert((yield cal1.minus) === 2);
        done();
      })();
    });
  });

  describe('thunkify(object) with ctx', function () {
    it('should work ok', function (done) {
      var cal2 = new Cal(2, 1);
      cal2 = thunkify(cal2);
      co(function *() {
        assert((yield cal2.plus) === 3);
        assert((yield cal2.minus) === 1);
        done();
      })();
    });
  });
});
