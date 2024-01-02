import { RequestHandler } from "express";
import { App } from "../app";

const logReq = ((req, res, next) => {
  const initialTs = performance.now();

  res.on("finish", () => {
    console.info(
      `[${new Date().toLocaleString("FR-fr")} (${(performance.now() - initialTs).toFixed(2)}ms})] ${
        req.method
      } "${req.originalUrl}".`,
    );
  });

  next();
}) satisfies RequestHandler;

export default function registerMiddlewares(app: App) {
  app.express.use(logReq);
}
