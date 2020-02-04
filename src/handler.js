const Router = require('./router');


/**
 * Inits the Application in an Express-like fashion
 */
class App {
    constructor() {
        this._methods = ['get','post','put','patch','delete','options','head','any'];
        this._routes = [];
        this._methods.forEach(method => {
            this[method] = (path, fn) => {
                this._routes.push({ route: new Router(method, path), fn });
                return this;
            };
        });

        this._res = {
            json: (data) => ({
                statusCode: 200,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }}),
            // TODO Add additional methods users can call on the response
        };
        return this;
    }

    listen(event, context) {
        let matched = false;
        this._response = null; // The users actual response data given from this._res.json() etc... todo find a way to say res.json(...) instead of return res.json(...)
        this._routes.forEach(({ route, fn }) => {
            if(route.match(event)) {
                matched = true;
                console.log('Event is triggering the route: ', route);
                this._response = fn(event, this._res);
                console.log('Actual response from user: ', this._response)
            }
        });

        if(!matched) {
            console.log('[INFO] No routes matched');
            return {
                statusCode: 404,
                body: '404 The incoming request did not match any known routes.',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        }

        return this._response;
    }
}

module.exports = App;

