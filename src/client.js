let config = require('./config'),
    mqtt = require('mqtt'),
    db = require('./db');

module.exports = {
    run: function(){
        const clientOptions = {
            clientId: config.mqtt.clientId,
            keepalive: 5,
            clean: true

        };

        let client = mqtt.connect(config.mqtt.url, clientOptions);

        client.on('connect', function(){
            console.log('Connected');
            client.unsubscribe('#');
            client.subscribe('#');
            client.subscribe('#');
            client.on('message', onMessageReveived);
            console.log(client.listeners('message'));
        });

        // ['reconnect', 'close', 'offline', 'error', 'packetsend', 'packetreceive'].forEach(function(event){
        //     client.on(event, function(){
        //         console.log(event);
        //     })
        // });

        client.on('packetreceive', function(p){
            console.log('packet received:', p);
        });

        client.on('offline', function(p){
            console.log('offline');
        });


        function onMessageReveived(topic, message){
            console.log('Message reveived');
            db.ensureTopic(topic);
            db.logMessage(topic, message.toString());
        }
    }
};
