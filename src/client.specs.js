'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const assert = require('chai').assert;

let mqtt, mqttClient, config, client;

function MqttClientStub(){
    let handlers = {};

    this.on = function(event, cb){
        handlers[event] = cb;
    };
    this.subscribe = function(){};

    this.raiseEvent = function(event){
        let cb = handlers[event];
        if (cb){
            cb.call(null);
        }
    }
}

function MqttStub(){
    this.connect = function(){};
}

function createConfigStub(){
    return {
        url: 'mqtt://test',
        clientId: 'mqtt client'
    }
}

describe('Client should', () => {

    beforeEach(function(){
        mqttClient = new MqttClientStub();
        sinon.spy(mqttClient, 'on');
        sinon.spy(mqttClient, 'subscribe');

        mqtt = new MqttStub();
        sinon.stub(mqtt, 'connect').returns(mqttClient);
        
        config = createConfigStub();
        client = proxyquire('./client', { './config': config, mqtt: mqtt });
    });

    afterEach(function(){
        mqtt = null;
        mqttClient = null;
        config = null;
        client = null;
    });


    it('connect to mqtt broker', function(){
        client.run();
        assert.isTrue(mqtt.connect.calledOnce, 'Client did not connect to broker');
        
    });

    it('connect to url specified in config file', function() {
        client.run();
        assert.equal(mqtt.connect.getCall(0).args[0], 'mqtt://test', 'Client connects to wrong url');
    });

    describe('provice correct connection options from config file', function(){

        it ('clientId', function(){
            client.run();
            assert.equal(mqtt.connect.getCall(0).args[1].clientId, 'mqtt client', 'Client connects with wrong clientId');
        });
    });
    
    it('subscribe to all topics', function(){
        client.run();
        mqttClient.raiseEvent('connect');
        assert.isTrue(mqttClient.subscribe.called, 'Client did not subscribe to any event');
        assert.equal(mqttClient.subscribe.getCall(0).args[0], '#', 'Client does not subscribe to all topics');
    });

    it('should subscribe to message event', function(){
        client.run();
        mqttClient.raiseEvent('connect');
        assert.equal(mqttClient.on.getCall(1).args[0], 'message', 'Client does not subscribe message event');
    });

});

