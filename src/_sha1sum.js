const crypto = require('crypto');

export const sha1sum = values => {
  var sha1 = crypto.createHash('sha1');
  sha1.update(values);
  return sha1.digest('hex').toUpperCase();
};

export default sha1sum;
