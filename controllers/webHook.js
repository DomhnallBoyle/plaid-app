var fs = require('fs');
var mongoose = require('mongoose');
var requestLib = require('request');
var moment = require('moment');
var config = require('../config.js');
var logger = require('../logger.js');

Item = mongoose.model('Item');

const TYPE_TRANSACTIONS = 'TRANSACTIONS';
const EVENT_HISTORICAL_UPDATE = 'HISTORICAL_UPDATE';
const EVENT_DEFAULT_UPDATE = 'DEFAULT_UPDATE';

exports.process = function(request, response) {
    var webhookType = request.body.webhook_type;
    var webhookCode = request.body.webhook_code;

    if (webhookType == TYPE_TRANSACTIONS) {
        /* Types of transaction events fired: 
        INITIAL_UPDATE - when an item's initial transaction pull is completed
        HISTORICAL_UPDATE - when an item's historical transaction pull is completed
        DEFAULT_UPDATE - when new transaction data is available 
        TRANSACTIONS_REMOVED - when transactions for an item are deleted
        */

        if (webhookCode == EVENT_HISTORICAL_UPDATE || webhookCode == EVENT_DEFAULT_UPDATE) {
            var time = moment().format('LLL');
            logger.info(`${webhookCode} at ${time}`);

            // lookup access token using item id
            var itemId = request.body.item_id;

            // extracts YYYY-MM-DD date
            var todaysDate = new Date().toISOString().split('T')[0];

            Item.findOne({_id: itemId}, function(error, item) {
                var start_date = null;
                var end_date = null;

                if (webhookCode == EVENT_HISTORICAL_UPDATE) {
                    // get transactions since account began
                    start_date = '2000-01-01';
                    end_date = todaysDate;
                }
                
                if (webhookCode == EVENT_DEFAULT_UPDATE) {
                    // get transactions from previous transaction pull
                    start_date = moment(item.previous_transaction_pull).format('YYYY-MM-DD'); 
                    end_date = todaysDate;
                }

                query = {
                    'client_id': config.PLAID_CLIENT_ID,
                    'secret': config.PLAID_SECRET_KEY,
                    'access_token': item.access_token,
                    'start_date': start_date,
                    'end_date': end_date
                }

                // new transactions available - request the transactions from plaid
                requestLib.post(config.PLAID_ENV_URL + 'transactions/get', {json: query}, function(error, response, body) {
                    // get transactions here
                    if (!error && response.statusCode == 200)
                        parseTransactions(body.transactions);
                });

                // update the items last transaction pull
                item.previous_transaction_pull = todaysDate;
                item.save(function(error) {
                    if (error) 
                        console.log('Failed to edit item.')
                });
            });
        }
    }
};

function parseTransactions(transactions) {
    var action = "";

    for (var transaction of transactions) {
        var name = transaction.name;
        var location = transaction.location;
        var currency = transaction.iso_currency_code;
        var amount = transaction.amount;
        var date = transaction.date;

        if (amount < 0)
            action = "deposited";
        else 
            action = "withdrawn";

        amount = Math.abs(amount);
        logger.info(`${amount} ${currency} was ${action} at ${name} on ${date}`);
    }

    // write json to file
    fs.writeFile('./transactions.json', JSON.stringify(transactions, null, 4), function(error) {
        if (error) {
            console.error(err); 
            return;
        }

        console.log('File has been created');
    });
}
