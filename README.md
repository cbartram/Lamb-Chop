<p align="center">
    <img src="https://i.imgur.com/UJFWYj3.png" />
</p>

# Lamb Chop
Lamb Chop provides an elegant and expressive syntax for using a single Lambda function as a proxy service for API Gateway routes. Write serverless code 
in a server oriented manner.

## Getting Started

Before you can use this service make sure you setup your AWS API Gateway as a proxy service. You can create a single route which accepts any http request
and path using the special `/{path+}`. Please see [this AWS document](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-http.html) for more
information on setting up your lambda function as a proxy service.

### Installing

You can install this package through NPM with

```
npm i --save lamb-chop
```

Check out the following example for using the service in a live system:

```javascript
const Api = require('lambda-api-router');
const app = new Api();

app.get('/foo/bar', (req, res) => {
    res.json({ success: true, test: 'Its working!', response: response.substring(0, 21) });
});

app.post('/foo/bar', (req, res) => {
    // ...
});

app.put('/users/find', (req, res) => {
    // ...
});

app.delete('/user/:id', (req, res) => {
    // ...
});

exports.handler = async (event, context) => app.listen(event, context);

```

## Async Actions

You can also use asynchronous actions and promises within your route handlers:

```javascript
const Api = require('lambda-api-router');
const request = require('request-promise-native');

const app = new Api();

app.get('/foo/bar', async (req, res) => {
    const response = await request('http://google.com');
    res.json({ success: true, response: response.substring(0, 21) });
});

exports.handler = (event, context) => app.listen(event, context);
```

## Query & Request Params

You can easily access query and request parameters through `req.query` and `req.params` respectively.

```javascript
const Api = require('lamb-chop');

const app = new Api();

app.get('/foo/bar', (req, res) => {
    res.json({ query: req.query, params: req.params });
});

exports.handler = (event, context) => app.listen(event, context);
```

## Set Response Status & Headers

You can easily access query and request parameters through `req.query` and `req.params` respectively.

```javascript
const Api = require('lambda-api-router');

const app = new Api();

app.get('/foo/bar', (req, res) => {
    const headers = { 
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };
   
    res.headers(headers)
       .status(200)
       .json({ query: req.query, params: req.params });
});

exports.handler = (event, context) => app.listen(event, context);
```

## Deployment

This is deployed through the deployment script called: `./scripts/publish.sh`.

## Built With

* [Node.JS](https://nodejs.org/en/) - The web framework used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Javascript](https://www.javascript.com/) - Programming language used
* [Lambda](https://aws.amazon.com/lambda/) - Serverless web technology

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Christian Bartram** - *Initial work* - [cbartram](https://github.com/cbartram)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Express for creating a great framework

