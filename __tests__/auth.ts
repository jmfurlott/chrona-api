import axiosist from "axiosist";
import * as faker from "faker";

import createConnection from "../src/connection";
import makeApp from "../src/app";
import { testFactory } from "./utils";
import { User } from "../src/entity/User";


let connection;
beforeAll(async () => {
  connection = await createConnection();
});

afterAll(() => connection.close());

test('POST /auth/local/login creates a user and returns token', async (): Promise<any> => {
  const app = makeApp();

  const formData = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const res = await axiosist(app).post(`/auth/local/signup`, formData);
  expect(res.status).toBe(200);
  expect(res.data.email).toBe(formData.email);
  expect(res.data.encrypted_password).toBeTruthy();
  expect(res.data.encrypted_password).toBeTruthy();
});
