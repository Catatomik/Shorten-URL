const router = require("express").Router()
const fs = require('fs');

module.exports = () => {
    const files = fs.readdirSync('./routes/')
    for (const file of files) {
        if (!file.endsWith('.js') || file == "index.js") return;
        require(`./${file}`)(router)
    }
    return router
}