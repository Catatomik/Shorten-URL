import { NextFunction, RequestHandler, Request, Response } from "express";
import { App } from "../app";
import { hasAttribute } from "../utils";

const logReq = ((req, res, next) => {
  const initialTs = performance.now();

  res.on("finish", () => {
    console.info(
      `[${new Date().toLocaleString("FR-fr")} (${(performance.now() - initialTs).toFixed(2)}ms)] ${
        req.method
      } "${req.originalUrl}".`,
    );
  });

  next();
}) satisfies RequestHandler;

const requirePassword = (app: App) =>
  ((req: Request, res: Response, next: NextFunction) => {
    if (
      (!hasAttribute(req.body, "password") || req.query.password != app.config.password) &&
      (!hasAttribute(req.query, "password") || req.query.password != app.config.password)
    ) {
      res.status(401).send("Authentication error");
      // Prevent further execution
      return;
    }

    next();
  }) satisfies RequestHandler;

export default function registerMiddlewares(app: App) {
  app.express.use(logReq);
}

export { requirePassword };
