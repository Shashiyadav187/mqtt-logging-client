class FactorMiddleware {

    constructor(options) {
        this._factor = options && options.factor ? options.factor : 0.1;
    }

    parse(value) {
        return value * this._factor;
    }
}

module.exports = FactorMiddleware;
