import "reflect-metadata";
import { createConnection } from "typeorm";

require("dotenv").config();

import { User } from "./entity/User";
import { Bookmark } from "./entity/Bookmark";

import makeApp from "./app";

console.log("env", process.env);

createConnection({
  type: "postgres",
  host: process.env.BOOKMARKS_DB_HOST,
  port: 5432,
  username: process.env.BOOKMARKS_DB_USERNAME,
  password: process.env.BOOKMARKS_DB_PASSWORD,
  database: process.env.BOOKMARKS_DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Bookmark,
  ]
}).then(() => {
  // Start express server
  const app = makeApp();
  app.listen(3000, () => console.log("Server started at 3000"));

}).catch(error => console.log(error));
