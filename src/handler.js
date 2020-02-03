const Router = require('./router');


/**
 * Inits the Application in an Express-like fashion
 */
class App {
    constructor() {
        this._methods = ['get','post','put','patch','delete','options','head','any'];
        this._methods.forEach(method => {
            this[method] = (path, fn) => {
                const route = new Router(method, path);
                console.log('Route: ', route);
                if(route.match(this._req)) {
                    fn()
                }
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
        this._req = event;
    }
}

module.exports = App;

