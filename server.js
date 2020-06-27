var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

// express app
app = express();

// takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// setup models + mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/plaid_webhook_app', {useNewUrlParser: true});
for (var model of ['user', 'item']) {
    require('./models/' + model);
}

// setup routes
for (var routes of ['index', 'plaid', 'user', 'webHook']) {
    routes = require('./routes/' + routes);
    routes(app);
}

app.listen(config.PORT, () => {
    console.log(`App running on port ${config.PORT}`);
});
