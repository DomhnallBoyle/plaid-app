module.exports = function(app) {
    var userController = require('../controllers/user')

    app.route('/users')
        .post(userController.createUser);

    app.route('/users/:id')
        .get(userController.getUser);
}