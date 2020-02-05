const Api = require('./src/handler');
const request = require('request-promise-native');

const app = new Api();

app.get('/foo/:bar', async (req, res) => {
    console.log('Executed GET on /foo/:bar with params: ', req.params);

    const response = await request('http://google.com');
    res.json({ success: true, test: 'Its working!', response: response.substring(0, 21) });
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


