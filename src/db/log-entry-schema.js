const mongoose = require('mongoose');

const logEntrySchema = new mongoose.Schema({
    topic: String,
    rawValue: String,
    value: Object,
}, { collection: 'log' });

module.exports = logEntrySchema;
