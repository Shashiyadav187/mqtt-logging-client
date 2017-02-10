const mqtt = require('mqtt');
const config = require('./config');
const DB = require('./db/db');
const Client = require('./client');

new Client(config, mqtt, new DB()).run();
