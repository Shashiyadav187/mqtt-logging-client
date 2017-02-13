const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    topic: String,
}, { collection: 'topics' });

module.exports = topicSchema;
