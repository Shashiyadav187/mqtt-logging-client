let config = require('./config'),
    mqtt = require('mqtt');

module.exports = {
    run: function(){
        const clientOptions = {
            clientId: config.mqtt.clientId
        };

        let client = mqtt.connect(config.mqtt.url, clientOptions);

        client.on('connect', function(){
            client.subscribe('#');
            client.on('message');
        });

        function onMessageReveived(topic, message){

        }
    }
};
