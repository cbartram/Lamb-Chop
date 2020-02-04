const event = require('../data/data');
const Api = require('./handler');


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

app.run(event);