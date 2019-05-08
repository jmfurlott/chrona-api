import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as passport from "passport";
import { Application, Request, Response } from "express";

import { name, author, version } from "../package.json";
import routes from "./routes";
import { initPassport, authRoutes } from "./passport";

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

  /* Set up resource routes */
  app.use(routes());

  return app;
};

// app.use(
//   "/api/secure",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.json({ secure: "test" });
//   },
// )
