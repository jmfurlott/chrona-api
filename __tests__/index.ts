import axiosist from "axiosist";
import { createConnection } from "typeorm";

import makeApp from "../src/app";
import { testFactory } from "./utils";


let connection;
beforeAll(async () => {
  connection = await createConnection();
});

afterAll(() => connection.close());


test('Establishes connection and starts app', async (): Promise<any> => {
  const app = makeApp();

  const res = await axiosist(app).get("/users");

  await testFactory(connection);

  expect(res.status).toBe(200);
});
