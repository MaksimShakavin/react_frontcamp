import express from 'express';
import path from 'path';
import handleRender from './app/server/handleRander'

const PORT = 7700;
const PUBLIC_PATH = '.';

var app = express();

app.use(express.static(PUBLIC_PATH));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// Serve requests with our handleRender function
app.get('*', handleRender);

app.listen(PORT, function() {
    console.log('Listening on port ' + PORT + '...');
});

