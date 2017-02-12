const MiddlewareFactory = require('../../src/middleware/middleware-factory');
const expect = require('chai').expect;

let m;

class InvalidPlugin { }

class FakePlugin {
    constructor(options) {
        this.options = options;
    }

    parse() {}
}

describe('Middleware should', () => {
    beforeEach(() => {
        m = new MiddlewareFactory();
    });

    afterEach(() => {
        m = null;
    });

    describe('throw exception when registering middleware', () => {
        it('with no topic', () => {
            expect(m.use.bind()).to.throw(TypeError, /topic should be a not empty stirng/);
        });

        it('with non-string topic', () => {
            expect(m.use.bind(m, 1)).to.throw(TypeError, /topic should be a not empty stirng/);
        });

        it('with empty topic', () => {
            expect(m.use.bind(m, '')).to.throw(TypeError, /topic should be a not empty stirng/);
        });

        it('with no middleware class', () => {
            expect(m.use.bind(m, 'a')).to.throw(TypeError, /middleware should be a function or class/);
        });

        it('with non-function middleware', () => {
            expect(m.use.bind(m, 'a', 1)).to.throw(TypeError, /middleware should be a function or class/);
        });

        it('that has no parse() method', () => {
            expect(m.use.bind(m, 'a', InvalidPlugin)).to.throw(TypeError, /middleware should have a parse\(\) method/);
        });
    });

    it('register middleware for a given topic', () => {
        m.use('topic', FakePlugin);

        expect(m._handlers).to.have.key('topic');
    });

    it('be able to register several middlewares to same topic', () => {
        m.use('topic', FakePlugin);
        m.use('topic', FakePlugin);

        expect(m._handlers.topic.length).to.equal(2);
    });

    it('pass options when instantiationg middleware', () => {
        const options = {};
        m.use('topic', FakePlugin, options);

        expect(m._handlers.topic[0].options).to.equal(options);
    });

    describe('thow exception when running middleware', () => {
        it('if topic not specified', () => {
            expect(m.getValue.bind(m)).to.throw(TypeError, /topic should be a not empty stirng/);
        });
        
        it('if topic is empty', () => {
            expect(m.getValue.bind(m, '')).to.throw(TypeError, /topic should be a not empty stirng/);
        });

        it('if topic not string', () => {
            expect(m.getValue.bind(m, 1)).to.throw(TypeError, /topic should be a not empty stirng/);
        });
    });

    ['string', 2, 5.5, { a: 'value' }, undefined, null].forEach((value) => {
        it(`return same value if there are no middlewares for topic (${JSON.stringify(value)})`, () => {
            expect(m.getValue('topic', value)).to.eql(value);
        });
    });

    it('return value from middleware registered for topic', () => {
        function plugin() {
            this.parse = function pserse(v) {
                return v * 2;
            };
        }

        m.use('topic', plugin);

        expect(m.getValue('topic', 2)).to.equal(4);
    });

    it('return value from middleware sequence registered for topic', () => {
        function pluginb() {
            this.parse = function pserse(v) {
                return `${v}b`;
            };
        }
        function pluginc() {
            this.parse = function pserse(v) {
                return `${v}c`;
            };
        }
        function plugind() {
            this.parse = function pserse(v) {
                return `${v}d`;
            };
        }

        m.use('topic', pluginb);
        m.use('topic', pluginc);
        m.use('topic', plugind);

        expect(m.getValue('topic', 'a')).to.equal('abcd');
    });
});
