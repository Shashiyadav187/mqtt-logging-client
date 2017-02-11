class Middleware {

    constructor() {
        this._handlers = {};
    }

    use(topic, middleware, options) {
        if (!(topic && typeof topic === 'string')) {
            throw new TypeError('topic should be a not empty stirng');
        }

        if (!(middleware && typeof middleware === 'function')) {
            throw new TypeError('middleware should be a function or class');
        }

        if (!(topic in this._handlers)) {
            this._handlers[topic] = null;
        }

        const handler = new middleware(options);

        if (!(handler.parse && typeof handler.parse === 'function')) {
            throw new TypeError('middleware should have a parse() method');
        }

    }

    getValue(topic, rawValue) {
        
    }
}

module.exports = Middleware;
