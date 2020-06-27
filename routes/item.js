module.exports = function(app) {
    var itemController = require('../controllers/user')

    app.route('/item')
        .post(userController.create_user)

}