import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";

import makeApp from "./app";

createConnection().then(/* async */ connection => {

  // Start express server
  const app = makeApp();
  app.listen(3000);
  console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
