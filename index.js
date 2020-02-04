const Api = require('./src/handler');
const request = require('request-promise-native');

const app = new Api();

app.get('/foo/bar', async (req, res) => {
    console.log('Executed GET on /foo/bar');

    const response = await request('http://google.com');
    res.json({ success: true, test: 'Its working!', response: response.substring(0, 21) });
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
 * Core body of the lambda function which
 * listens for any incoming events and matches them against the
 * registered routes
 * @param event Object the Lambda Event Http proxy
 * @param context Object Lambda context object
 */
exports.handler = async (event, context) => {
    console.log('[INFO] Received event:', JSON.stringify(event, null, 2));
    return app.listen(event, context);
};


