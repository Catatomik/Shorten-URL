import http from "http";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { App } from "./app";

import { API as config } from "../../config.json";
import utils from "./utils";
import registerMiddlewares from "./middlewares";
import registerRoutes from "./routes";

const client = new MongoClient(config.database.url);
client.connect().then((client) => {
  const db = client.db();
  db.createIndex("urls", { shortened: "text" }, { unique: true });
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
  console.log(`Server started and listening on https://${config.host}:${config.port}.`);
});
