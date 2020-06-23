const express = require('express');
const app = express();
const PORT = 19090;

app
.get('/public/style', (req, res) => {
    console.log('styles opened')
    res.sendFile(__dirname + '/index.css');
})
.get('/public/canvas', (req, res) => {
    console.log('script has been opened!');
    res.sendFile(__dirname + '/index.js');
})
.get('/', function(req, res) {
    console.log('page has been opened!');
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, (res, req) => {
    console.log(`Server started on port ${PORT}.`)
});