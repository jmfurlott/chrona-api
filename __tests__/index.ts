import * as axiosist from "axiosist";
import { Connection } from "typeorm";

import createConnection from "../src/connection";
import makeApp from "../src/app";

let connection: Connection;
beforeAll(async () => {
  connection = await createConnection();
});

afterAll(() => connection.close());

test('Establishes connection and starts app', async (): Promise<any> => {
  const app = makeApp();
  const res = await axiosist(app).get("/");
  expect(res.status).toBe(200);
});
