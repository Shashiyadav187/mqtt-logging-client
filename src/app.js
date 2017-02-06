const mqtt = require('mqtt');
const config = require('./config');
const db = require('./db');
const Client = require('./client');

new Client(config, mqtt, db).run();
