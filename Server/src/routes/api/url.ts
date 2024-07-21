import { Response, Router } from "express";
import { Route, RouteRegister } from "../register";
import { App } from "../../app";
import { CustomError, hasAttribute } from "../../utils";
import { Stat, URL } from "../../models";
import { requirePassword } from "../../middlewares";

const router = Router();

export default ((app: App) => {
  const urls = app.db.collection<URL>("urls");

  router
    .route("/")
    .all(requirePassword(app))

    .get((_, res: Response<URL[]>, next) => {
      urls
        .find({})
        .toArray()
        .then((results) => {
          res.json(results);
          next();
        })
        .catch((err) => {
          console.error(err);
          next(new Error("Database find failed"));
        });
    });

  router
    .route("/:url")
    .all(requirePassword(app))

    .get((req, res: Response<URL[]>, next) => {
      urls
        .find({ shortened: req.params.url })
        .toArray()
        .then((results) => {
          res.json(results);
          next();
        })
        .catch((err) => {
          console.error(err);
          next(new Error("Database find failed"));
        });
    })

    .post((req, res, next) => {
      if (!hasAttribute(req.body, "dest") || typeof req.body.dest !== "string")
        throw new CustomError("No destination provided.", 400);

      urls
        .insertOne({
          shortened: req.params.url,
          dest: req.body.dest,
        })
        .then(() => {
          res.status(200).end();
          next();
        })
        .catch((err) => {
          console.error(err);
          next(new Error("Database insert failed"));
        });
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .delete(async (req, res, next) => {
      try {
        await app.db.collection<Stat>("stats").deleteMany({ shortened: req.params.url });
        const r = await urls.deleteOne({ shortened: req.params.url });

        if (r.deletedCount == 0) {
          next(new Error("No corresponding shortened URL found."));
          return;
        }

        res.status(200).end();
      } catch (err) {
        console.error(err);
        throw new Error("Database delete failed");
      }

      next();
    });

  return {
    router,
    path: "/url",
  } as Route;
}) satisfies RouteRegister;
