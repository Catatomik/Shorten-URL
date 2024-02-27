import { Express } from "express";
import { MongoClient, Db } from "mongodb";
import type { API } from "../../config.json";
import utils from "./utils";

interface APIConfig extends API {
  port: number;
  host: string;
  database: {
    url: string;
  };
  password: string;
}

export interface App {
  express: Express;
  config: APIConfig;
  utils: utils;
  mongoClient: MongoClient;
  db: Db;
}
