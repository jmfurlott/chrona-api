import * as axiosist from "axiosist";
import { Connection } from "typeorm";
import * as faker from "faker";

import createConnection from "../src/connection";
import makeApp from "../src/app";
import { testFactory } from "./utils";
import { User } from "../src/entity/User";


let connection: Connection;
beforeAll(async () => {
  connection = await createConnection();
});

afterAll(() => connection.close());

test('POST /auth/local/signup and logins succesfully', async (): Promise<any> => {
  const app = makeApp();

  const formData = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  let res = await axiosist(app).post(`/auth/local/signup`, formData);
  expect(res.status).toBe(200);
  expect(res.data.email).toBe(formData.email);
  expect(res.data.encrypted_password).toBeTruthy();

  res = await axiosist(app).post(`/auth/local/login`, formData);
  expect(res.status).toBe(200);
  expect(res.data.email).toBe(formData.email);
  expect(res.data.encrypted_password).toBeTruthy();
});

/* TODO
test('POST login with missing account returns error');
test('POST login with incorrect password returns error');
*/
