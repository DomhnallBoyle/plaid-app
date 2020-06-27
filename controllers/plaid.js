var mongoose = require('mongoose');
var plaidClient = require('../helpers/plaid');

User = mongoose.model('User');
Item = mongoose.model('Item');

exports.setAccessToken = function(request, response) {
    var userId = request.body.user_id;
    var publicToken = request.body.public_token;
    
    plaidClient.exchangePublicToken(publicToken, function(error, tokenResponse) {
        if (error)
            return response.status(400).json({message: error.message});

        accessToken = tokenResponse.access_token;
        itemId = tokenResponse.item_id;

        Item.findOneAndRemove({user: userId}, function(error) {});

        new Item({_id: itemId, user: userId, access_token: accessToken}).save(function(error) {
            if (error)
                return response.status(500).json({message: error.message});
            
            // TODO: Atomic find and update
            User.findOneAndUpdate({_id: userId}, {item: itemId}, function(error, user) {
                if (error)
                    return response.status(500).json({message: error.message});
            
                response.status(200).json({user});
            });
        });
    });
};
