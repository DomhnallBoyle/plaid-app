// check Plaid environment
plaidEnv = process.argv[2];
if (! ['sandbox', 'development'].includes(plaidEnv)) {
    console.log('USAGE: npm run start-test/start-dev');
    process.exit();
}

require('dotenv').config({ path: `variables-${plaidEnv}.env`});

var config = {};
config.PORT = process.env.PORT || 8080;
config.PLAID_ENV = plaidEnv;
config.PLAID_ENV_URL = process.env.PLAID_ENV_URL;
config.PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
config.PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
config.PLAID_SECRET_KEY = process.env.PLAID_SECRET_KEY;
config.PLAID_PRODUCTS = 'transactions';
config.PLAID_COUNTRY_CODES = 'GB';

module.exports = config;
