import { Router } from "express";
import { Route, RouteRegister } from "../register";
import { App } from "../../app";
import { Stat, URL } from "../../models";
import { CustomError } from "../../utils";

const router = Router();

export default ((app: App) => {
  const urls = app.db.collection<URL>("urls");
  const stats = app.db.collection<Stat>("stats");

  router
    .route("/:url")

    .get((req, res, next) => {
      urls
        .findOne({ shortened: req.params.url })
        .then((url) => {
          if (url) {
            res.redirect(url.dest);

            // Update stats
            void stats.insertOne({
              shortened: req.params.url,
              date: Date.now(),
            });
          } else next(new CustomError("Unknown shortened link.", 404));

          next();
        })
        .catch((err) => {
          console.error(err);
          next(new Error("Unable to retrieve link"));
        });
    });

  return {
    router,
    path: "/",
  } as Route;
}) satisfies RouteRegister;
