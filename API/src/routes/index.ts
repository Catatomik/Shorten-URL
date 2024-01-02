export interface SuccessResponse {
  status: 200;
}

export interface ErrorResponse {
  status: number;
  error: string | object;
}

export type RouteRegister = (app: App) => void;

import fs from "fs";
import { App } from "../app";

export default function registerRoutes(app: App) {
  const files = fs.readdirSync("./routes/");
  for (const file of files) {
    if (!file.endsWith(".js") || file == "index.js") continue;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (require(`./${file}`).default as RouteRegister)(app);
  }
}
