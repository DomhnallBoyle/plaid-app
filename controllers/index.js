var path = require('path'); 
var fs = require('fs');

exports.content = function(request, response) {
    var filename = request.params.filename;
    var filepath = path.join(__dirname, '../assets', filename)

    fs.access(filepath, fs.F_OK, (error) => {
        if (error) {
            response.json({message: 'File does not exist.'});
            return;
        }

        // file exists
        response.sendFile(filepath);
    });
}
