const express = require("express")
const fs = require('fs');
const https = require('https');
const MongoClient = require('mongodb').MongoClient;

const config = require('../config.json').API
const app = express()
app.use((req, res, next) => {
    console.info(`[${(new Date()).toLocaleString("FR-fr")}] Treating request ${req.method} "${req.originalUrl}".`)
    next()
})
require('./routes')(app)

MongoClient.connect(config.database.url, {
    options: {
        auth: {
            user: config.database.username,
            password: config.database.password
        }
    }
}, (err, client) => {
    if (err) throw err
    app.client = client
    app.db = client.db()
    app.db.createIndex("urls", { shortened: "text" }, { unique: true })
    console.log("Database connected.")
});

const opts = {
   key: fs.readFileSync(config.key),
   cert: fs.readFileSync(config.cert)
};

https.createServer(opts, app).listen(config.port);
console.log(`Server started and listening on https://localhost:${config.port}.`)