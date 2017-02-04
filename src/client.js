let config = require('./config'),
    mqtt = require('mqtt');

module.exports = {
    run: function(){
        const clientOptions = {
            clientId: config.clientId
        };

        let client = mqtt.connect(config.url, clientOptions);

        client.on('connect', function(){
            client.subscribe('#');
            client.on('message');
        });

        function onMessageReveived(topic, message){
            
        }
    }
};
