const Router = require('./router');
const isUndefined = require('lodash/isUndefined');

/**
 * Inits the Application in an Express-like fashion
 */
class App {
    constructor() {
        this._methods = ['get','post','put','patch','delete','options','head','any'];
        this._routes = [];
        this._middleware = [];
        this._methods.forEach(method => {
            this[method] = (path, fn) => {
                // Register standard functions for GET, POST, PATCH, DELETE ...
                this._routes.push({
                    route: new Router(method, path),
                    fn
                });
                return this;
            };
        });

        this._response = null;
        this._res = {
            status: (statusCode) => {
              this._response = {
                  ...this._response,
                  statusCode,
              };
              return this._res;
            },
            send: (data) => {
              this._response = { ...this._response, ...data };
              return this._res;
            },
            headers: (headers) => {
                this._response = {
                    ...this._response,
                    headers,
                };
                return this._res;
            },
            json: (data) => {
                if(!this._response) {
                    this._response = {
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    };
                }
                this._response = {
                    ...this._response,
                    headers: {
                        ...this._response.headers,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data),
                };
                return this._res;
            },
        };
        return this;
    }

    cors() {
        this._response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials": true
            }
        }
    }

    use(fn) {
        if (typeof fn !== 'function') {
            throw new Error('Middleware must be a function with 2 parameters. First parameter is the incoming event and the second is the response object to modify.')
        }
        this._middleware.push(fn);
    }

    async listen(event, context) {
        let matched = false;
        // Must break out of the loop after we match the first route
        // so that we don't accidentally execute more than 1 route
        for(let i = 0; i < this._routes.length; i++) {
            const { route, middleware, fn } = this._routes[i];
            const match = route.match(event);
            if(match) {
                for(let j = 0; j < this._middleware.length; j++) {
                    await this._middleware[j](event, this._res);
                }
                event = {
                    ...event,
                    query: event.queryStringParameters,
                    params: match.params
                };
                matched = true;
                if(!isUndefined(middleware)) {
                    middleware(event, this._res);
                }
                await fn(event, this._res);
                break;
            }
        }
        if(!matched) {
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

