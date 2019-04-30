import { Router } from "express";
import * as express from "express";

import users from "./users";
import bookmarks from "./bookmarks";

export default (): Router => {
  const router = express.Router();

  router.use(bookmarks());
  router.use(users());

  return router;
};
