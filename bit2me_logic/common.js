const crypto = require('crypto');

const getMessageSignature = (message, secret) => {
    const hash = new crypto.createHash('sha256');
    const hmac = new crypto.createHmac('sha512', secret);
    const hashDigest = hash.update(message).digest('binary');
    const hmacDigest = hmac.update(hashDigest, 'binary').digest('base64');

    return hmacDigest;
};

const commerceSignature = (payload, secret) => crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

module.exports = {
  getMessageSignature,
  commerceSignature
};