import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { Application, Request, Response } from "express";

import { Routes } from "./routes";


export default (): Application => {
  // create express app
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  // register express routes from defined application routes
  Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
      const result = (new (route.controller as any))[route.action](req, res, next);
      if (result instanceof Promise) {
        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    });
  });

  return app;
};
