'use strict';

var thunkify = require('..');
var assert = require('assert');
var fs = require('fs');

describe('thunkify.genify(fn)', function () {
  var readFile = fs.readFile;
  after(function () {
    fs.readFile = readFile;
  });

  it('should work when sync', function* () {
    var read = function (file, fn) {
      fn(null, 'file: ' + file);
    };

    read = thunkify.genify(read);

    assert('file: foo.txt' === (yield* read('foo.txt')));
  });

  it('should work when async', function* () {
    var read = function (file, fn) {
      setTimeout(function () {
        fn(null, 'file: ' + file);
      }, 5);
    };

    read = thunkify.genify(read);

    assert('file: foo.txt' === (yield* read('foo.txt')));
  });

  it('should pass all results', function* () {
    var read = function (file, fn) {
      setTimeout(function () {
        fn(null, file[0], file[1]);
      }, 5);
    };

    read = thunkify.genify(read);
    var r = yield* read('foo.txt');
    assert('f' === r[0]);
    assert('o' === r[1]);
  });

  it('should work with node methods', function* () {
    fs.readFile = thunkify.genify(fs.readFile);

    var buf = yield* fs.readFile('package.json');
    assert(Buffer.isBuffer(buf));

    var str = yield* fs.readFile('package.json', 'utf8');
    assert('string' === typeof str);
  });
});
