import { Router } from "express";
import * as express from "express";

import users from "./users";

export default (): Router => {
  const router = express.Router();

  router.use(users());

  return router;
};
