import { Router } from "express";

export type RouteRegister = (app: App) => { router: Router; basePath: string };
