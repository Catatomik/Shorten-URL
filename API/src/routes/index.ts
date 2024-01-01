import fs from "fs";
import { App } from "../app";
import { RouteRegister } from "./route";

export default function registerRoutes(app: App) {
  const files = fs.readdirSync("./routes/");
  for (const file of files) {
    if (!file.endsWith(".js") || file == "index.js") continue;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const exec = (require(`./${file}`).default as RouteRegister)(app);
    app.express.use(exec.basePath, exec.router);
  }
}
