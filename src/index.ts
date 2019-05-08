import "reflect-metadata";

require("dotenv").config();

import createConnection from "./connection";
import makeApp from "./app";

console.log("env", process.env);

createConnection().then(() => {
  // Start express server
  const app = makeApp();
  app.listen(3000, () => console.log("Server started at 3000"));

}).catch(error => console.log(error));
