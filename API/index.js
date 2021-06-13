const express = require("express")
const fs = require('fs');
const https = require('https');
const MongoClient = require('mongodb').MongoClient;

const config = require('../config.json').API
const app = express()
const router = require('./routes')()
app.use(router)

MongoClient.connect(config.database.url, {
    options: {
        auth: {
            user: config.database.username,
            password: config.database.password
        }
    }
});

const opts = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
};

https.createServer(opts, app).listen(config.port);