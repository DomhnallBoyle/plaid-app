var config = require('../config');
var plaid = require('plaid');

// setup plaid client
module.exports = new plaid.Client(
    config.PLAID_CLIENT_ID,
    config.PLAID_SECRET_KEY,
    config.PLAID_PUBLIC_KEY,
    plaid.environments[config.PLAID_ENV],
    {version: '2019-05-29', clientApp: 'Plaid Quickstart'}
);
