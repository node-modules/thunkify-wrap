
var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var thunkify = require('..');

describe('thunkify.event(event)', function () {
  it('should ok by globalEvents', function (done) {
    var e = new EventEmitter();
    var end = thunkify.event(e, 'finish');
    e.on('data', function (data) {
      assert(data.foo === 'bar');
    });
    end()(function (err, data) {
      assert(!err);
      assert(data.success);
      done();
    });
    e.emit('data', {foo: 'bar'});
    e.emit('finish', {success: true});
  });

  it('should ok by custom events', function (done) {
    var e = new EventEmitter();
    var end = thunkify.event(e, 'finish');
    e.on('data', function (data) {
      assert(data.foo === 'bar');
    });
    end('close')(function (err, data) {
      assert(!err);
      assert(data.success);
      done();
    });
    e.emit('data', {foo: 'bar'});
    e.emit('close', {success: true});
  });

  it('should ok by custom events with array', function (done) {
    var e = new EventEmitter();
    var end = thunkify.event(e, 'finish');
    e.on('data', function (data) {
      assert(data.foo === 'bar');
    });
    end(['close', 'end'])(function (err, data) {
      assert(!err);
      assert(data.success);
      done();
    });
    e.emit('data', {foo: 'bar'});
    e.emit('end', {success: true});
    e.emit('end', {success: true}); // will ignore
  });

  it('should error by error', function (done) {
    var e = new EventEmitter();
    var end = thunkify.event(e, 'finish');
    e.on('data', function (data) {
      assert(data.foo === 'bar');
    });
    end(['close', 'end'])(function (err, data) {
      assert(err.message === 'mock error');
      done();
    });
    e.emit('data', {foo: 'bar'});
    e.emit('error', new Error('mock error'));
  });
});
