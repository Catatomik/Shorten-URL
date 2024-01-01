import { RequestHandler } from "express";
import { App } from "../../app";

const logReq = ((req, _: unknown, next) => {
  console.info(
    `[${new Date().toLocaleString("FR-fr")}] Treating request ${req.method} "${req.originalUrl}".`,
  );
  next();
}) satisfies RequestHandler;

export default function registerMiddlewares(app: App) {
  app.express.use(logReq);
}
