const mongoose = require('mongoose');
const config = require('./config');

class DB {
    constructor() {
        const topicSchema = new mongoose.Schema({
            topic: String,
        }, { collection: 'topics' });

        const logEntrySchema = new mongoose.Schema({
            topic: String,
            rawValue: String,
            value: Object,
        }, { collection: 'log' });

        mongoose.Promise = global.Promise;
        this._connection = mongoose.createConnection(config.db.url);
        this._topics = this._connection.model('Topic', topicSchema);
        this._log = this._connection.model('LogEntry', logEntrySchema);
    }

    ensureTopic(topic) {
        console.log(Object.keys(this._topics.findOne({ topic: 'a' })));
        console.dir(`ensure topis: ${topic}`);
    }

    logMessage(topic, message) {
        console.log(`logMessage("${topic}", "${message}")`);
    }
}

module.exports = DB;
