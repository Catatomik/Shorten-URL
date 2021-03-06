const express = require("express")
const fs = require('fs');
const https = require('https');
const { MongoClient } = require('mongodb');
var cors = require('cors')

const config = require('../config.json').API
const app = express()
app.config = config
app.utils = require('./utils')
app.use(cors())
app.use(
    express.urlencoded({
      extended: true
    })
  )
app.use(express.json())
app.use((req, _, next) => {
    console.info(`[${(new Date()).toLocaleString("FR-fr")}] Treating request ${req.method} "${req.originalUrl}".`)
    next()
})
require('./routes')(app)

const client = new MongoClient(config.database.url)
client.connect().then((client) => {
    app.client = client
    app.db = client.db()
    app.db.createIndex("urls", { shortened: "text" }, { unique: true })
    console.log("Database connected.")
})


const opts = {
   key: fs.readFileSync(config.key),
   cert: fs.readFileSync(config.cert)
};

https.createServer(opts, app).listen(config.port, config.host);
console.log(`Server started and listening on https://${config.host}:${config.port}.`)