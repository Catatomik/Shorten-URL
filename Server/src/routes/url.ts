export interface URL {
  shortened: string;
  dest: string;
}

import { Response, Router } from "express";
import { ErrorResponse, RouteRegister, SuccessResponse } from ".";
import { App } from "../app";
import { Stat } from "./stats";
const router = Router();
import { hasAttribute } from "../utils";

export default ((app: App) => {
  const urls = app.db.collection<URL>("urls");

  router
    .route("/")

    .get((req, res: Response<URL[] | ErrorResponse>, next) => {
      if (!req.query?.password || req.query.password != app.config.password) {
        res.status(401).send({ status: 401, error: "Authentication error." });
        next();
      } else {
        void urls
          .find({})
          .toArray()
          .then((results) => {
            res.send(results);
            next();
          });
      }
    });

  router
    .route("/:url")

    .get((req, res: Response<URL[] | ErrorResponse>, next) => {
      void urls
        .find({ shortened: req.params.url })
        .toArray()
        .then((results) => {
          res.send(results);
          next();
        });
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .post(async (req, res: Response<SuccessResponse | ErrorResponse>, next) => {
      if (!hasAttribute(req.body, "password") || req.body.password != app.config.password) {
        res.status(401).send({ status: 401, error: "Authentication error." });
        next();
      } else {
        if (!hasAttribute(req.body, "dest") || typeof req.body.dest !== "string")
          return res.status(400).send({ status: 400, error: "No destination provided." });
        try {
          await urls.insertOne({
            shortened: req.params.url,
            dest: req.body.dest,
          });
          res.status(200).send({ status: 200 });
        } catch (e) {
          res.status(500).send({ status: 500, error: e as object });
        }
        next();
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .delete(async (req, res: Response<SuccessResponse | ErrorResponse>, next) => {
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
          res.status(500).send({ status: 500, error: e as object });
        }
        next();
      }
    });

  app.express.use("/url", router);
}) satisfies RouteRegister;
