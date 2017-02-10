class MqttClient {
    constructor(config, mqtt, db) {
        this._config = config;
        this._mqtt = mqtt;
        this._db = db;
    }

    run() {
        const clientOptions = {
            clientId: this._config.mqtt.clientId,
        };
        const client = this._mqtt.connect(this._config.mqtt.url, clientOptions);

        client.on('connect', () => {
            client.subscribe('#');
        });

        client.on('message', (topic, message) => {
            this._onMessageReceived(topic, message);
        });
    }

    _onMessageReceived(topic, message) {
        this._db.logMessage(topic, message.toString());
    }
}

module.exports = MqttClient;
