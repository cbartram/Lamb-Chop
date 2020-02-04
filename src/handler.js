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

        this._response = null;
        this._res = {
            json: (data) => {
                this._response = {
                    statusCode: 200,
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };
            },
            // TODO Add additional methods users can call on the response
        };
        return this;
    }

    async listen(event, context) {
        let matched = false;
        this._response = null;

        // Must break out of the loop after we match the first route
        // so that we don't accidentally execute more than 1 route
        for(let i = 0; i < this._routes.length; i++) {
            const { route, fn } = this._routes[i];
            if(route.match(event)) {
                matched = true;
                console.log('Event is triggering the route: ', route);
                await fn(event, this._res);
                console.log('Actual response from user: ', this._response);
                break;
            }
        }

        console.log('this._response = ', this._response);

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

