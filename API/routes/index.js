const fs = require('fs');

module.exports = (app) => {
    const files = fs.readdirSync('./routes/')
    for (const file of files) {
        if (!file.endsWith('.js') || file == "index.js") continue;
        const exec = require(`./${file}`)(app)
        app.use(exec.basePath, exec.router)
    }
}