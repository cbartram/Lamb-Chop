const { describe, it } = require('mocha');
const expect = require('chai').expect;
const Router = require('../src/router');

describe('Router Tests', () => {
    it('Successfully creates new Router object', (done) => {
        const router = new Router('GET', '/foo');
        expect(router).to.be.a('object');
        done();
    });

    it('Returns false for mismatching HTTP methods', (done) => {
        const router = new Router('GET', '/foo');
        expect(router).to.be.a('object');
        const matches = router.match({
            httpMethod: 'POST', // Does not match the registered GET route
            path: '/foo'
        });
        expect(matches).to.be.a('boolean').that.equals(false);
        done();
    });

    it('Returns false for mismatching paths', (done) => {
        const router = new Router('GET', '/foo');
        expect(router).to.be.a('object');
        const matches = router.match({
            httpMethod: 'POST', // Does not match the registered GET route
            path: '/bar'
        });
        expect(matches).to.be.a('boolean').that.equals(false);
        done();
    });

    it('Returns true for matching HTTP methods', (done) => {
        const router = new Router('GET', '/foo');
        expect(router).to.be.a('object');
        const matches = router.match({
            httpMethod: 'GET',
            path: '/foo'
        });
        expect(matches).to.be.a('object').that.deep.equals({ path: '/foo', index: 0, params: {} });
        done();
    });

    it('Returns the given path and route', (done) => {
        const router = new Router('GET', '/foo');
        expect(router).to.be.a('object');
        expect(router.method).to.be.a('string').that.equals('GET');
        expect(router.path).to.be.a('string').that.equals('/foo');
        done();
    });
});