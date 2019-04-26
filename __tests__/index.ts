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
  expect(res.status).toBe(200);
});


test('GET /users/:id returns expected user', async (): Promise<any> => {
  const app = makeApp();
  const { user } = await testFactory(connection);
  const res = await axiosist(app).get(`/users/${ user.id }`);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(user.id);
});
