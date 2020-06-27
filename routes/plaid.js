module.exports = function(app) {
    var plaidController = require('../controllers/plaid')

    app.route('/plaid/access-token')
        .post(plaidController.setAccessToken);

}