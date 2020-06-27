var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    previous_transaction_pull: {
        type: Date
    }
});

module.exports = mongoose.model('Item', ItemSchema);
