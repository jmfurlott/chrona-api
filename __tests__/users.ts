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

/*
 * NOTE: Currently skipping all these as user routes were never intended to work
 * like this; simply just a hello world for typeorm/express setup
 */


test.skip('GET /users returns expected count', async (): Promise<any> => {
  const app = makeApp();

  const expectedCount: number = await connection.getRepository(User).count({ archived: false });
  const res = await axiosist(app).get(`/users`);
  expect(res.status).toBe(200);
  expect(res.data.length).toBe(expectedCount);
});


test.skip('GET /users/:id returns expected user', async (): Promise<any> => {
  const app = makeApp();
  const { user } = await testFactory();
  const res = await axiosist(app).get(`/users/${user.id}`);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(user.id);
});


test.skip('PUT /users/:id updates and returns expected user', async (): Promise<any> => {
  const app = makeApp();
  const { user } = await testFactory();

  const newData = {
    name: faker.name.findName(),
  };

  const res = await axiosist(app).put(`/users/${user.id}`, newData);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(user.id);
  expect(res.data.name).toBe(newData.name);
});


test.skip('POST /users creates and returns expected user', async (): Promise<any> => {
  const app = makeApp();

  const newUser = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    github_id: faker.random.uuid(),
  };

  const res = await axiosist(app).post(`/users`, newUser);

  expect(res.status).toBe(200);
  expect(res.data.name).toBe(newUser.name);
  expect(res.data.email).toBe(newUser.email);
  expect(res.data.github_id).toBe(newUser.github_id);
});


test.skip('DELETE /users/:id updates and returns 204', async (): Promise<any> => {
  const app = makeApp();
  const { user } = await testFactory();

  // The actual delete returns a 204
  let res = await axiosist(app).delete(`/users/${user.id}`);
  expect(res.status).toBe(204);

  // Show now 404
  res = await axiosist(app).get(`/users/${user.id}`);
  expect(res.status).toBe(404);
});
