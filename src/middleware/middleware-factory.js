class MiddlewareFactory {

    constructor() {
        this._handlers = {};
    }

    use(topic, middleware, options) {
        if (!topic || typeof topic !== 'string') {
            throw new TypeError('topic should be a not empty stirng');
        }

        if (!middleware || typeof middleware !== 'function') {
            throw new TypeError('middleware should be a function or class');
        }

        const handler = new middleware(options);

        if (!handler.parse || typeof handler.parse !== 'function') {
            throw new TypeError('middleware should have a parse() method');
        }

        if (!(topic in this._handlers)) {
            this._handlers[topic] = [];
        }

        this._handlers[topic].push(handler);
    }

    getValue(topic, rawValue) {
        if (!(topic && typeof topic === 'string')) {
            throw new TypeError('topic should be a not empty stirng');
        }

        const handlers = this._handlers[topic];
        if (!handlers || (handlers && handlers.length === 0)) {
            return rawValue;
        }

        return handlers.reduce((value, plugin) => {
            return plugin.parse(value);
        }, rawValue);
    }
}

module.exports = MiddlewareFactory;
