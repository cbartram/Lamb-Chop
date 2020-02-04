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
            json: () => {},
            // TODO Add additional methods users can call on the response
        };
        return this;
    }

    run(event) {
        this._routes.forEach(({ route, fn }) => {
            console.log('Registered routes: ', route);
            if(route.match(event)) {
                console.log('Event is triggering the route: ', route);
                fn(event, this._res);
            }
        })
    }
}

module.exports = App;

