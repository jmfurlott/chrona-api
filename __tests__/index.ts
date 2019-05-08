import axiosist from "axiosist";

import createConnection from "../src/connection";
import makeApp from "../src/app";

let connection;
beforeAll(async () => {
  connection = await createConnection();
});

afterAll(() => connection.close());

test('Establishes connection and starts app', async (): Promise<any> => {
  const app = makeApp();
  const res = await axiosist(app).get("/users");
  expect(res.status).toBe(200);
});
