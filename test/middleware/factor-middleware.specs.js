const expect = require('chai').expect;
const Factor = require('../../src/middleware/factor-middleware');

describe('Factor middleware should', () => {
    it('use 0.1 as default factor', () => {
        const factor = new Factor();
        const result = factor.parse(10);
        expect(result).to.equal(1);
    });

    it('use 0.1 if zero is suppied as option', () => {
        const factor = new Factor({ factor: 0 });
        const result = factor.parse(2);
        expect(result).to.equal(0.2);
    });

    it('use factor supplied by options', () => {
        const factor = new Factor({ factor: 2 });
        const result = factor.parse(2);
        expect(result).to.equal(4);
    });

    it('parse string integer values', () => {
        const factor = new Factor({ factor: 2 });
        const result = factor.parse('2');
        expect(result).to.equal(4);
    });

    it('parse string float values', () => {
        const factor = new Factor({ factor: 2 });
        const result = factor.parse('0.5');
        expect(result).to.equal(1);
    });
});
