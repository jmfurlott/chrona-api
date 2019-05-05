import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { Bookmark } from "./entity/Bookmark";

import makeApp from "./app";

createConnection({
  type: "postgres",
  host: "bookmarks-api-dev.csijvd7n1pva.us-east-1.rds.amazonaws.com",
  port: 5432,
  username: "jmfurlott",
  password: "52RoUWaeaYLEDRy",
  database: "bookmarks",
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
