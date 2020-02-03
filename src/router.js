const { match } = require("path-to-regexp");

class Router {
    constructor(method, path) {
        this.method = method;
        this.path = path;
        this.matches = match(this.path, { decode: decodeURIComponent });
    }

    match(event) {
        const { httpMethod, path } = event;
        if(httpMethod.toUpperCase() !== this.method.toUpperCase()) return false;
        console.log(this.matches(path));
        return this.matches(path);
    }
}

module.exports = Router;
