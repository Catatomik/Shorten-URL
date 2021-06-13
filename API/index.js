const express = require("express")
const fs = require('fs');
const https = require('https');
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', function(err) {
  if (err) {
    throw err;
  }
});

const config = require('../config.json').API
const app = express()
const router = require('./routes')()
app.use(router)

const opts = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
};

https.createServer(opts, app).listen(config.port);