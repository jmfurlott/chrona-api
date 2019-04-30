import axiosist from "axiosist";
import * as faker from "faker";
import { createConnection } from "typeorm";

import makeApp from "../src/app";
import { testFactory } from "./utils";
import { User } from "../src/entity/User";


let connection;
beforeAll(async () => {
  connection = await createConnection();
});

afterAll(() => connection.close());


test('GET /users returns expected count', async (): Promise<any> => {
  const app = makeApp();

  const expectedCount: number = await connection.getRepository(User).count();
  const res = await axiosist(app).get(`/users`);
  expect(res.status).toBe(200);
  expect(res.data.length).toBe(expectedCount);
});


test('GET /users/:id returns expected user', async (): Promise<any> => {
  const app = makeApp();
  const { user } = await testFactory(connection);
  const res = await axiosist(app).get(`/users/${ user.id }`);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(user.id);
});


test('PUT /users/:id updates and returns expected user', async (): Promise<any> => {
  const app = makeApp();
  const { user } = await testFactory(connection);

  const newData = {
    name: faker.name.findName(),
  };

  const res = await axiosist(app).put(`/users/${ user.id }`, newData);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(user.id);
  expect(res.data.name).toBe(newData.name);
});


test('POST /users creates and returns expected user', async (): Promise<any> => {
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


test('DELETE /users/:id updates and returns 204', async (): Promise<any> => {
  const app = makeApp();
  const { user } = await testFactory(connection);

  // The actual delete returns a 204
  let res = await axiosist(app).delete(`/users/${ user.id }`);
  expect(res.status).toBe(204);

  // Show now 404
  res = await axiosist(app).get(`/users/${ user.id }`);
  expect(res.status).toBe(404);
});
