const router = require("express").Router()

module.exports = (app) => {
    router.route("/")
    
        .get(async (_, res, next) => {
            const results = await app.db.collection('urls').find({}).toArray()
            res.send(results)
            next()
        })

    router.route("/:url")

        .get(async (req, res, next) => {
            const results = await app.db.collection('urls').find({ shortened: req.params.url }).toArray()
            res.send(results)
            next()
        })

        .post(async (req, res, next) => {
            if (!req.body?.dest) return res.status(400).send({ status: 400, error: "No destination provided." })
            try {
                await app.db.collection('urls').insertOne({
                    shortened: req.params.url,
                    dest: req.body.dest
                })
                res.status(200).send({ status: 200 })
            } catch(e) {
                console.error(e)
                res.status(500).send({ status: 500, error: e })
            }
            next()
        })

        .delete(async (req, res, next) => {
            try {
                const r = await app.db.collection('urls').deleteOne({ shortened: req.params.url })
                if (r.deletedCount == 0) throw new Error("No corresponding shortened URL found.")
                res.status(200).send({ status: 200 })
            } catch(e) {
                res.status(500).send({ status: 500, error: e })
            }
            next()
        })
        
    return {
        router,
        basePath: "/url"
    }
}