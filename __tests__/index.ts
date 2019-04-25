import axiosist from "axiosist";
import { createConnection } from "typeorm";

import makeApp from "../src/app";

test('Establishes connection and starts app', async () => {
  await createConnection()
  const app = makeApp();

  const res = await axiosist(app).get("/users");

  expect(res.status).toBe(200);
});
