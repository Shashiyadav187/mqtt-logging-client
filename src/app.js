var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://10.10.10.15');
 
client.on('connect', function () {
  client.subscribe('#');
  console.log('connected');
  //client.publish('presence', 'Hello mqtt')
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(`${topic}@${message.toString()}`);
  client.end();
})