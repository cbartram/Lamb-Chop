const event = require('../data/data');
const Api = require('./handler');


const app = new Api();

console.log(app);
app.get('/foo/bar', (req, res) => {
    console.log('Executed')
});

app.run(event);