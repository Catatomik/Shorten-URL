import { join } from "path";
import { Router } from "express";
import { App } from "../app";

interface Route {
  router: Router;
  path: string;
}

type RouteRegister = (app: App) => Route;

export type { Route, RouteRegister };

import { readdirSync } from "fs";

export default function registerRoutes(app: App) {
  const files = readdirSync(__dirname, { withFileTypes: true });
  for (const file of files) {
    if (!file.isDirectory()) continue;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const route = (require(join(__dirname, file.name)) as { default: RouteRegister }).default(app);
    app.express.use(route.path, route.router);
  }
}
