var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    item: {
        type: String,
        ref: 'Item'
    }
});
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
