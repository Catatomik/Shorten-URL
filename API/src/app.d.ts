import { Express } from "express";
import { MongoClient, Db } from "mongodb";
import { API } from "../../config.json";
import utils from "./utils";

export interface App {
  express: Express;
  config: API;
  utils: utils;
  mongoClient: MongoClient;
  db: Db;
}
