var mongoose = require('mongoose');

User = mongoose.model('User');

exports.createUser = function(request, response) {
    // check if user exists already
    User.findOne({username: request.body.username}, function(error, user) {
        if (user)
            return response.status(409).json({message: 'Username already taken.'});
        else {
            // save user if username not taken
            new User(request.body).save(function(error, user) {      
                if (error)
                    return response.status(400).json({message: error.message}) 

                response.status(201).end(JSON.stringify(user, null, 4));
            });
        }
    });
};

exports.getUser = function(request, response) {
    var user_id = request.params.id;

    if (mongoose.Types.ObjectId.isValid(user_id))
        query = {_id: user_id};
    else
        query = {username: user_id};

    User.findOne(query, function(error, user) {
        if (error || !user) {
            message = error ? error.message : 'User not found.';
            return response.status(404).json({message});
        }

        response.status(200).end(JSON.stringify(user));
    });
}