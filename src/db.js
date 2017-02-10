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
        return this._topics
            .findOne({ topic })
            .then((result) => {
                if (!result) {
                    return this._topics.create({ topic });
                }
                return null;
            });
    }

    logMessage(topic, message) {
        this
            .ensureTopic(topic)
            .then(this._log.create({ topic, rawValue: message }));
    }
}

module.exports = DB;
