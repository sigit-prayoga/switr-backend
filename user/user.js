module.exports = function(app, db) {
    var module = {};
    module.getAll = function(userId, callback) {
        //get db instance here
        db.collection('users', function(err, users) {
            //at least print the error
            if (err) console.log(err);
            if (typeof userId !== 'function') {
            	//if userId exist
            	uses.find("userId": userId, function(err, user){
            		if (err) console.log(err);
            		callback(user, err);
            	})
            } else {
                //send back users and error through callback
                callback(users, err);
            }
        });
    };

    return module;
}