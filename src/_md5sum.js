const crypto = require('crypto');

export const md5sum = values => {
  var md5 = crypto.createHash('md5');
  md5.update(values);
  return md5.digest('hex').toUpperCase();
};
export default md5sum;
