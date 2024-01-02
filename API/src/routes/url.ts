export interface URL {
  shortened: string;
  dest: string;
}

import { Router } from "express";
import { RouteRegister } from "./route";
import { App } from "../app";
import { Stat } from "./stats";
const router = Router();

export default ((app: App) => {
  const urls = app.db.collection<URL>("urls");

  router
    .route("/")

    .get(async (req, res, next) => {
      if (!req.query?.password || req.query.password != app.config.password) {
        res.status(401).send({ status: 401, error: "Authentication error." });
        next();
      } else {
        const results = await urls.find({}).toArray();
        res.send(results);
        next();
      }
    });

  router
    .route("/:url")

    .get(async (req, res, next) => {
      const results = await urls.find({ shortened: req.params.url }).toArray();
      res.send(results);
      next();
    })

    .post(async (req, res, next) => {
      if (!req.body?.password || req.body.password != app.config.password) {
        res.status(401).send({ status: 401, error: "Authentication error." });
        next();
      } else {
        if (!req.body?.dest) return res.status(400).send({ status: 400, error: "No destination provided." });
        try {
          await urls.insertOne({
            shortened: req.params.url,
            dest: req.body.dest,
          });
          res.status(200).send({ status: 200 });
        } catch (e) {
          res.status(500).send({ status: 500, error: e });
        }
        next();
      }
    })

    .delete(async (req, res, next) => {
      if (!req.query?.password || req.query.password != app.config.password) {
        res.status(401).send({ status: 401, error: "Authentication error." });
        next();
      } else {
        try {
          await app.db.collection<Stat>("stats").deleteMany({ shortened: req.params.url });
          const r = await urls.deleteOne({ shortened: req.params.url });
          if (r.deletedCount == 0) throw new Error("No corresponding shortened URL found.");
          res.status(200).send({ status: 200 });
        } catch (e) {
          res.status(500).send({ status: 500, error: e });
        }
        next();
      }
    });

  app.express.use("/url", router);
}) satisfies RouteRegister;
