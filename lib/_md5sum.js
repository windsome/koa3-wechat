'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var crypto = require('crypto');

var md5sum = exports.md5sum = function md5sum(values) {
  var md5 = crypto.createHash('md5');
  md5.update(values);
  return md5.digest('hex').toUpperCase();
};
exports.default = md5sum;