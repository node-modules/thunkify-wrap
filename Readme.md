
# thunkify-wrap [![Build Status](https://secure.travis-ci.org/dead-horse/node-thunkify-wrap.png)](http://travis-ci.org/dead-horse/node-thunkify-wrap)

  Turn each node function in an object return a thunk.
  Turn a regular node function into one which returns a thunk,
  useful for generator-based flow control such as [co](https://github.com/visionmedia/co).

## Installation

[![NPM](https://nodei.co/npm/thunkify-wrap.png?downloads=true)](https://nodei.co/npm/thunkify-wrap/)

## Example

```js
// the same as thunkify
var thunkify = require('thunkify-wrap');
var fs = require('fs');

fs.readFile = thunkify(fs.readFile);

fs.readFile('package.json', 'utf8')(function(err, str){

});

// tunkfiy an object
var user = {
  add: function () {},
  show: function () {},
  list: function () {}
}

module.exports = thunkify(user);
```

# License

  MIT
