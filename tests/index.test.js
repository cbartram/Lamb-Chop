const { describe, it } = require('mocha');
const expect = require('chai').expect;
const App = require('../src/index');

describe('Index Tests', () => {
   it('Successfully creates new Application', (done) => {
       const app = new App();
       console.log(app);
       expect(app).to.be.a('object');
       expect(app.cors).to.be.a('function');
       done();
   });

   it('Successfully registers new routes', (done) => {
       const app = new App();
       app.get('/foo', (req, res) => {});
       expect(app._routes).to.be.a('array').with.length(1);
       done();
   });

    it('Successfully adds cors() headers to new routes', (done) => {
        const app = new App();
        app.cors()
        app.get('/foo', (req, res) => {});
        expect(app._routes).to.be.a('array').with.length(1);
        expect(app._response.headers).to.be.a('object').that.deep.equals({
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials": true
        });
        done();
    });

    it('Adds status code to response object', (done) => {
        const app = new App();
        app._res.status(599);
        expect(app._response.statusCode).to.be.a('number').that.equals(599);
        done();
    });

    it('Adds custom headers to the response object', (done) => {
        const app = new App();
        app._res.headers({
            'X-Custom-Header': 'custom-header-value'
        });
        expect(app._response.headers).to.be.a('object').that.deep.equals({
            'X-Custom-Header': 'custom-header-value'
        });
        done();
    });

    it('Adds custom json headers to the response object', (done) => {
        const app = new App();
        app._res.headers({
            'X-Custom-Header': 'custom-header-value'
        });

        app._res.json({ test: true });
        expect(app._response.headers).to.be.a('object').that.deep.equals({
            'X-Custom-Header': 'custom-header-value',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        expect(app._response.body).to.be.a('string').that.equals('{\"test\":true}');
        done();
    });

    it('Returns 404 if route does not match incoming request', async () => {
        const app = new App();
        app.get('/foo', (req, res) => {});
        const response = await app.listen({
            httpMethod: 'GET',
            path: '/not/found'
        }, null);

        expect(response).to.be.a('object').that.deep.equals({
            statusCode: 404,
            body: '404 The incoming request did not match any known routes.',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
    });

    it('Calls the passed function if the route matches', async () => {
        const app = new App();
        app.get('/foo', (req, res) => {
            res.json({ func: 'called' })
        });
        const response = await app.listen({
            httpMethod: 'GET',
            path: '/foo'
        }, null);

        expect(response).to.be.a('object').that.deep.equals({
            statusCode: 200,
            body: "{\"func\":\"called\"}",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
    });

    it('Calls the passed function if the route matches for POST request', async () => {
        const app = new App();
        app.post('/foo', (req, res) => {
            res.json({ func: 'called' })
        });
        const response = await app.listen({
            httpMethod: 'POST',
            path: '/foo'
        }, null);

        expect(response).to.be.a('object').that.deep.equals({
            statusCode: 200,
            body: "{\"func\":\"called\"}",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
    });

    it('Calls the passed function for nested routes', async () => {
        const app = new App();
        app.post('/foo/bar/zoo', (req, res) => {
            res.json({ func: 'called' })
        });
        const response = await app.listen({
            httpMethod: 'POST',
            path: '/foo/bar/zoo'
        }, null);

        expect(response).to.be.a('object').that.deep.equals({
            statusCode: 200,
            body: "{\"func\":\"called\"}",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
    });

    it('Calls the passed function if the route doesnt contain a trailing slash', async () => {
        const app = new App();
        app.post('/foo', (req, res) => {
            res.json({ func: 'called' })
        });
        const response = await app.listen({
            httpMethod: 'POST',
            path: '/foo/'
        }, null);

        expect(response).to.be.a('object').that.deep.equals({
            statusCode: 200,
            body: "{\"func\":\"called\"}",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
    });


    it('Calls middleware functions in order of registration if they exist.', async () => {
        const app = new App();
        app.post('/foo', (req, res) => {
            res.json({ func: 'called' })
        });
        app.use((event, res) => {
           res.headers({
               'X-Middleware-Active': 'true',
           });
        });
        const response = await app.listen({
            httpMethod: 'POST',
            path: '/foo/'
        }, null);

        expect(response).to.be.a('object').that.deep.equals({
            body: "{\"func\":\"called\"}",
            headers: {
                'X-Middleware-Active': 'true',
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
    });
});