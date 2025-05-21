// Bit2me logic
const { getMessageSignature } = require('./common');

const getClientMessageToSign = (nonce, url, body) => {
    const hasBody = !!body && Object.keys(body).length > 0;
  
    return hasBody
      ? `${nonce}:${url}:${JSON.stringify(body)}`
      : `${nonce}:${url}`;
};

const getAuthHeaders = (path, subaccount, body) => {
  const nonce = Date.now();
  const messageToSign = getClientMessageToSign(nonce, path, body);
  const signature = getMessageSignature(messageToSign, process.env.SECRET);
  
  const response = {
    headers: {
      'x-api-key': process.env.API_KEY,
      'api-signature': signature,
      'x-nonce': nonce
    }
  };

  if(subaccount) response.headers['x-subaccount-id'] = subaccount;
  
  return response;
};
  
module.exports = {
    getClientMessageToSign,
    getAuthHeaders
};