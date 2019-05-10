import { Router } from "express";
import * as express from "express";

import users from "./users";
import bookmarks from "./bookmarks";
import publicTokens from "./publicTokens";

export default (): Router => {
  const router = express.Router();

  router.use(bookmarks());
  router.use(publicTokens());
  router.use(users());

  return router;
};
