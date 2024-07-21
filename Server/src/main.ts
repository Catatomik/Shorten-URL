import http from "http";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { App } from "./app";

import { API as config } from "../../config.json";
import utils from "./utils";
import registerMiddlewares from "./middlewares";
import registerRoutes from "./routes/register";

async function startup() {
  const client = new MongoClient(config.database.url);
  try {
    await client.connect();
  } catch (e) {
    throw new Error("Unable to connect DB");
  }

  const db = client.db();
  await db.createIndex("urls", { shortened: "text" }, { unique: true });
  console.log("Database connected.");

  const app: App = { express: express(), config, utils, mongoClient: client, db };
  app.express.use(cors());
  app.express.use(
    express.urlencoded({
      extended: true,
    }),
  );
  app.express.use(express.json());
  registerMiddlewares(app);
  registerRoutes(app);

  http.createServer(app.express).listen(config.port, config.host);
  console.log(`Server listening on https://${config.host}:${config.port}.`);
}

startup()
  .then(() => console.log("Server started"))
  .catch((err) => console.error("Cannot start server", err));
