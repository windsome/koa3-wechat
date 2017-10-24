'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var crypto = require('crypto');

var sha1sum = exports.sha1sum = function sha1sum(values) {
  var sha1 = crypto.createHash('sha1');
  sha1.update(values);
  return sha1.digest('hex').toUpperCase();
};

exports.default = sha1sum;