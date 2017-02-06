const sinon = require('sinon');
const assert = require('chai').assert;

const Client = require('../src/client');

class MqttLibClientStub {
    constructor() {
        this._handlers = {};
        sinon.spy(this, 'on');
        sinon.spy(this, 'subscribe');
    }

    raiseEvent(event) {
        const callback = this._handlers[event];
        if (callback) {
            callback.call(null);
        }
    }

    on(event, callback) {
        this._handlers[event] = callback;
    }

    subscribe() {}
}

class MqttLibStub {
    constructor(client) {
        sinon.stub(this, 'connect').returns(client);
    }

    connect() { }
}

let mqttLib;
let mqttLibClient;
let client;

describe('Client should', () => {
    beforeEach(() => {
        mqttLibClient = new MqttLibClientStub();
        mqttLib = new MqttLibStub(mqttLibClient);

        const config = {
            mqtt: {
                url: 'mqtt://test',
                clientId: 'mqtt client',
            },
        };

        client = new Client(config, mqttLib, null);
    });

    afterEach(() => {
        mqttLib = null;
        mqttLibClient = null;
        client = null;
    });


    it('connect to mqtt broker', () => {
        client.run();
        assert.isTrue(mqttLib.connect.calledOnce, 'Client did not connect to broker');
    });

    it('connect to url specified in config file', () => {
        client.run();
        assert.equal(mqttLib.connect.getCall(0).args[0], 'mqtt://test', 'Client connects to wrong url');
    });

    describe('provice correct connection options from config file', () => {

        it('clientId', () => {
            client.run();
            assert.equal(mqttLib.connect.getCall(0).args[1].clientId, 'mqtt client', 'Client connects with wrong clientId');
        });
    });
 
    it('subscribe to all topics', () => {
        client.run();
        mqttLibClient.raiseEvent('connect');
        assert.isTrue(mqttLibClient.subscribe.called, 'Client did not subscribe to any event');
        assert.equal(mqttLibClient.subscribe.getCall(0).args[0], '#', 'Client does not subscribe to all topics');
    });

    it('should subscribe to message event', () => {
        client.run();
        mqttLibClient.raiseEvent('connect');
        assert.equal(mqttLibClient.on.getCall(1).args[0], 'message', 'Client does not subscribe message event');
    });

});

