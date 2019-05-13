import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as passport from "passport";
import { Application, Request, Response } from "express";

import routes from "./routes";
import { checkPublicToken } from "./routes/bookmarks";
import { initPassport, authRoutes } from "./passport";
import { name, author, version } from "../package.json";

export default (): Application => {
  // create express app
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.get("/", (req: Request, res: Response) => {
    res.send({ name, author, version });
  });

  /* Set up passport */
  initPassport();
  app.use(passport.initialize());
  app.use(passport.session());

  /* Actually put the login/signup routes onto the app */
  app.use(authRoutes());

  /* Start middleware for passport for the all following routes */
  app.all("/*", checkPublicToken, passport.authenticate("jwt", { session: false }));

  /* Set up resource routes */
  app.use(routes());

  /* Basic error handler */
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status).json(err);
  });

  return app;
};
