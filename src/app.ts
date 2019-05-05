import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Application, Request, Response } from "express";

import routes from "./routes";

export default (): Application => {
  // create express app
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.use(routes());
  app.get('/', (req, res) => res.send('Hello World!'))

  return app;
};
