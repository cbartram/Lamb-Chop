const { match } = require("path-to-regexp");

class Router {
    constructor(method, path) {
        this._method = method;
        this._path = path;
        this._matches = match(this.path, { decode: decodeURIComponent });
    }

    match(event) {
        const { httpMethod, path } = event;
        if(httpMethod.toUpperCase() !== this._method.toUpperCase()) return false;
        return this._matches(path);
    }

    get path() {
        return this._path;
    }

    get method() {
        return this._method;
    }
}

module.exports = Router;
