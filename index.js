const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
const api = require('./api/index');
console.clear();
app.use(cors({ credentials: true, origin: true }));

function logger(req, res, next) {
    console.log('URL:', req.url);
    next();
}

function notFound(req, res) {
    res.status(404).send('Not Found Api!');
}

app.use(logger);
app.use('/api/', api);
// app.use(notFound);


app.listen(port);
console.log('Server started at http://localhost:' + port);