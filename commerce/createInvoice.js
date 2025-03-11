const axios  = require('axios');
const { commerceSignature } = require('../bit2me_logic/common')

const baseUrl = 'https://gateway.bit2me.com/v3/commerce';
const endpoint = '/invoices'

const payload = {
    "foreignId": 'XXXXXX', //! change
    "priceAmount": "1",
    "priceCurrency": "EUR",
    "title": "Title",
    "description": "Description",
    "successUrl": "https://company.com/ok", //! change
    "cancelUrl": "https://company.com/ko", //! change
    "purchaserEmail": "customer@email.com",
    "securityToken": "XXXXXX" //! change
   }

const options = {
    method: 'POST',
    url: baseUrl + endpoint,
    headers: {
        'Content-type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'b2m-processing-key': process.env.API_KEY,
        'b2m-secret-key': commerceSignature(payload, process.env.SECRET),
    },
    data: payload
};

axios
.request(options)
.then(function (response) {
    console.log(response.data);
})
.catch(function (error) {
    console.error(error);
});