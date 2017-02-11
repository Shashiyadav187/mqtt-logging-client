const Middleware = require('../../src/middleware/middleware');
const expect = require('chai').expect;

let m;

class InvalidPlugin { }

class FakePlugin {
    parse() {}
}

describe('Middleware should', () => {
    beforeEach(() => {
        m = new Middleware();
    });

    afterEach(() => {
        m = null;
    });

    describe('throw exception when', () => {
        it('registering middleware with no topic', () => {
            expect(m.use.bind()).to.throw(TypeError, /topic should be a not empty stirng/);
        });

        it('registering middleware with non-string topic', () => {
            expect(m.use.bind(m, 1)).to.throw(TypeError, /topic should be a not empty stirng/);
        });

        it('registering middleware with empty topic', () => {
            expect(m.use.bind(m, '')).to.throw(TypeError, /topic should be a not empty stirng/);
        });

        it('registering middleware with no middleware class', () => {
            expect(m.use.bind(m, 'a')).to.throw(TypeError, /middleware should be a function or class/);
        });

        it('registering middleware with non-function middleware', () => {
            expect(m.use.bind(m, 'a', 1)).to.throw(TypeError, /middleware should be a function or class/);
        });

        it('registering middleware that has no parse() method', () => {
            expect(m.use.bind(m, 'a', InvalidPlugin)).to.throw(TypeError, /middleware should have a parse\(\) method/);
        });
    });

    it('should register middleware for a given topic', () => {
        m.use('topic', FakePlugin);

        expect(m._handlers).to.have.key('topic');
    });

    
    
});
