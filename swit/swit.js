module.exports = function(app, db) {
    app.get('/api/swit/:id', function(req, res) {
        console.log(req.params.id);
        getSwit(req.params.id, function(swit, err) {
            if (!err) {
                console.log('the swit is: ', swit);
                res.send(swit);
            } else {
                res.send('ouch error dude!');
            }
        });
    });
    app.get('/api/swits', function(req, res) {
        //call swits collection from db if exists. Otherwise, create a new one
        var switsCollection = db.collection('swits');
        switsCollection.find().toArray(function(err, manySwits) {
            console.log('Total Swits: %d', manySwits.length);
            console.log('All swits: ', manySwits);
            res.json({
                swits: manySwits,
                message: 'Here is your swits'
            });
        });
    });
    app.post('/api/swit', function(req, res) {
        //fetch from db
        var switsCollection = db.collection('swits');
        //get the swit from req
        var swit = req.body.swit;
        //convert to obj by adding today time for sorting
        var switObj = changeToSwitObj(swit);
        //add a new obj to db
        switsCollection.insert(switObj, function(err, result) {
            if (err) {
                console.log('Error: ' + err);
            } else {
                console.log('Inserted %d documents into the "swtis" collection. The documents inserted with "_id" are:', result.length, result);
                //send a response back to frontend
                res.json({
                    message: 'Successfully added',
                    swit: switObj
                });
            }
        });
    });
    app.post('/api/like', function(req, res) {
        //grab switId and userId
        var which = req.body.switId;
        var who = req.body.userId;
        console.log('which: ', which);
        console.log('who: ', who);
        db.collection('swits').update({
            switId: which
        }, {
            $push: {
                likes: who
            }
        }, function(err, result) {
            if (err) {
                console.log('promise of updatedItem error: ', err);
            } else {
                console.log('promise of updatedItem success: ', result);
                res.json({
                    success: true,
                    message: 'thanks for liking it'
                })
            }
        });
    });
}

function getSwit(switId, callback) {
    db.collection('swits').find().toArray(function(err, swits) {
        console.log('swit on module: ', swits);
        for (var i = 0; i < swits.length; i++) {
            var current = swits[i];
            if (current.switId && current.switId == switId) {
                callback(current);
                break;
            }
        }
    });
}

function generateRandomId() {
	//import objectId
    var ObjectID = require('mongodb').ObjectID;
    //create a random id
    var randomId = new ObjectID();
    //return a string type
    return randomId.toString();
}

function changeToSwitObj(switText) {
    return {
        text: switText,
        time: new Date(),
        switId: generateRandomId(),
        userId: generateRandomId(),
        likes: []
    }
}