module.exports = function(app) {
    var webHookController = require('../controllers/webHook')

    app.route('/webhook')
        .post(webHookController.process)

}