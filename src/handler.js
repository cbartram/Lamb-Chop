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

    run(event, context) {
        let matched = false;
        this._routes.forEach(({ route, fn }) => {
            if(route.match(event)) {
                matched = true;
                console.log('Event is triggering the route: ', route);
                return fn(event, this._res);
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
    }
}

module.exports = App;

