const router = require("express").Router()

module.exports = (app) => {
    router.route("/:url")
        .get(async (req, res, next) => {
            const results = await app.db.collection('urls').find({ shortened: req.params.url }).toArray()
            res.send(results)
            next()
        })
        .post(async (req, res, next) => {
            if (!req.query.dest) return res.sendStatus(400)
            const dest = decodeURIComponent(req.query.dest)
            try {
                await app.db.collection('urls').insertOne({
                    shortened: req.params.url,
                    dest: dest
                })
                res.sendStatus(200)
            } catch(e) {
                res.sendStatus(500)
            }
            next()
        })
        .delete(async (req, res, next) => {
            try {
                await app.db.collection('urls').deleteOne({ shortened: req.params.url })
                res.sendStatus(200)
            } catch(e) {
                res.sendStatus(500)
            }
            next()
        })
    return {
        router,
        basePath: "/url"
    }
}