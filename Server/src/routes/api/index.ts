import { readdirSync } from "fs";
import { basename } from "path";
import { Router } from "express";
import { Route, RouteRegister } from "../register";
import { App } from "../../app";

const router = Router();

export default ((app: App) => {
  const files = readdirSync(__dirname, { withFileTypes: true });
  for (const file of files) {
    if (
      !file.isFile ||
      (process.env.TS_NODE !== "true" && !file.name.endsWith(".js")) ||
      file.name == basename(__filename)
    )
      continue;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const route = (require(`./${file.name}`) as { default: RouteRegister }).default(app);
    router.use(route.path, route.router);
  }

  router.get("/version", (_, res, next) => {
    res.status(200).json({ version: 1 });
    next();
  });

  return { router, path: "/api" } as Route;
}) satisfies RouteRegister;
