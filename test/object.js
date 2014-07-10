'use strict';

var thunkify = require('..');
var read = require('./support/read');
var assert = require('assert');
var copyRead = {};
for (var k in read) {
  copyRead[k] = read[k];
}

describe('thunkify(object)', function(){
  before(function () {
    thunkify(read);
    // thunkify twice still ok
    thunkify(read);

    thunkify.genify(copyRead);
    // thunkify.genify twice still ok
    thunkify.genify(copyRead);
  });

  it('should work when sync', function(done){
    read.sync('foo.txt')(function(err, res){
      assert(!err);
      assert('file: foo.txt' === res);
      done();
    });
  });

  it('should work when async', function(done){
    read.async('foo.txt')(function(err, res){
      assert(!err);
      assert('file: foo.txt' === res);
      done();
    });
  });

  it('should pass all results', function(done){
    read.multi('foo.txt')(function(err, a, b){
      assert(!err);
      assert('f' === a);
      assert('o' === b);
      done();
    });
  });

  it('should nothing happend to notFunc', function () {
    assert(read.notFunc, 'notFunc');
  });

  describe('genify()', function () {
    it('should work when sync', function* () {
      var res = yield* copyRead.sync('foo.txt');
      assert('file: foo.txt' === res);
    });

    it('should work when async', function* () {
      var res = yield* copyRead.async('foo.txt');
      assert('file: foo.txt' === res);
    });

    it('should pass all results', function* () {
      var r = yield* copyRead.multi('foo.txt');
      assert('f' === r[0]);
      assert('o' === r[1]);
    });

    it('should nothing happend to notFunc', function () {
      assert(copyRead.notFunc, 'notFunc');
    });
  });
});
