import { Router } from "express";
import { RouteRegister } from "./route";
const router = Router();

export default ((app) => {
  router
    .route("/")

    .get(async (req, res, next) => {
      if (!req.query?.password || req.query.password != app.config.password) {
        res.status(401).send({ status: 401, error: "Authentication error." });
        next();
      } else {
        const results = await app.db.collection("stats").find({}).toArray();
        res.send(results);
        next();
      }
    });

  router
    .route("/:url")

    .get(async (req, res, next) => {
      if (!req.query?.password || req.query.password != app.config.password) {
        res.status(401).send({ status: 401, error: "Authentication error." });
        next();
      } else {
        const results = await app.db.collection("stats").find({ shortened: req.params.url }).toArray();
        res.send(results);
        next();
      }
    })

    .post(async (req, res, next) => {
      try {
        const results = await app.db.collection("urls").find({ shortened: req.params.url }).toArray();
        if (!results.length) throw new Error("No corresponding shortened link.");
        await app.db.collection("stats").insertOne({
          shortened: req.params.url,
          date: Date.now(),
        });
        res.status(200).send({ status: 200 });
      } catch (e) {
        res.status(500).send({ status: 500, error: e });
      }
      next();
    })

    .delete(async (req, res, next) => {
      if (!req.query?.password || req.query.password != app.config.password) {
        res.status(401).send({ status: 401, error: "Authentication error." });
        next();
      } else {
        try {
          const r = await app.db.collection("stats").deleteMany({ shortened: req.params.url });
          if (r.deletedCount == 0) throw new Error("No corresponding shortened URL found.");
          res.status(200).send({ status: 200 });
        } catch (e) {
          res.status(500).send({ status: 500, error: e });
        }
        next();
      }
    });

  return {
    router,
    basePath: "/stats",
  };
}) satisfies RouteRegister;
