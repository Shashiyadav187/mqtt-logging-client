const 
    config = require('./config'),
    mongo = require('mongodb').MongoClient;

module.exports = new DBClient(config.db);

function DBClient(options){

    this.ensureTopic = function(topic){
        mongo
            .connect(options.url)
            .then((db) => {
                db.collection('topics')
                    .findOne({topic: topic})
                    .then((t) => {
                        if (!t){
                            db.collection('topics').insertOne({ topic: topic });
                            console.log('New topic inserted');
                        }
                    })
            })
    };

    this.logMessage = function(topic, message){
        mongo.connect(options.url)
            .then((db) => {
                db.collection('log').insertOne({topic: topic, rawValue: message});
            })
    }



}