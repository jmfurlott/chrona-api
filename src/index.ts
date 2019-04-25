import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";

import makeApp from "./app";

createConnection().then(/* async */ connection => {

  // start express server
  const app = makeApp();
  app.listen(3000);

  // insert new users for test
  // await connection.manager.save(connection.manager.create(User, {
  //     firstName: "Timber",
  //     lastName: "Saw",
  //     age: 27
  // }));
  // await connection.manager.save(connection.manager.create(User, {
  //     firstName: "Phantom",
  //     lastName: "Assassin",
  //     age: 24
  // }));

  console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
