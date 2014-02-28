
var Cal = function (a, b) {
  this.a = a;
  this.b = b;
};

Cal.prototype.plus = function(callback) {
  var self = this;
  setTimeout(function () {
    callback(null, self.a + self.b);
  }, 5);
};

Cal.prototype.minus = function (callback) {
  var self = this;
  setTimeout(function () {
    callback(null, self.a - self.b);
  }, 5);
};

module.exports = Cal;
