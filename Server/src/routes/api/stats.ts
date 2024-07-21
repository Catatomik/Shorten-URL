import { Response, Router } from "express";
import { Route, RouteRegister } from "../register";
import { App } from "../../app";
import { Stat } from "../../models";
import { requirePassword } from "../../middlewares";
import { CustomError } from "../../utils";

const router = Router();

export default ((app: App) => {
  const stats = app.db.collection<Stat>("stats");

  router
    .route("/:url")
    .all(requirePassword(app))

    .get((req, res: Response<Stat[]>, next) => {
      stats
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

    .delete((req, res, next) => {
      stats
        .deleteMany({ shortened: req.params.url })
        .then((r) => {
          if (r.deletedCount == 0) return next(new CustomError("No corresponding shortened link.", 404));

          res.status(200).end();
          next();
        })
        .catch((err) => {
          console.error(err);
          next(new Error("Database delete failed"));
        });
    });

  return {
    router,
    path: "/stats",
  } as Route;
}) satisfies RouteRegister;
