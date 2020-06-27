module.exports = function(app) {
    var indexController = require('../controllers/index')

    app.route('/content/:filename')
        .get(indexController.content);

}
