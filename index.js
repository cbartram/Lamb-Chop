const Api = require('./src/handler');

const app = new Api();

app.get('/foo/bar', (req, res) => {
    console.log('Executed GET on /foo/bar')
});

app.post('/foo/bar', (req, res) => {
    console.log('Executed POST on /foo/bar')
});

app.post('/users/find', (req, res) => {
    console.log('Executed POST on /users/find')
});

app.get('/test', (req, res) => {
    console.log('Executed GET on /test')
});


/**
 * Core body of the lambda function
 */
exports.handler = async (event, context) => {
    console.log('[INFO] Received event:', JSON.stringify(event, null, 2));
    return app.run(event, context)
};


