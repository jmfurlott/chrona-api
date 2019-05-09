import * as axiosist from "axiosist";
import axios from "axios";
import { AxiosInstance } from "axios";
import { Connection } from "typeorm";
import * as faker from "faker";

import createConnection from "../src/connection";
import makeApp from "../src/app";
import { testFactory } from "./utils";
import { Bookmark } from "../src/entity/Bookmark";


let connection: Connection;
let userRequest: AxiosInstance;
beforeAll(async () => {
  connection = await createConnection();

  // Login and generate a token
  const app = makeApp();
  const { data: { token } } = await axiosist(app).post("/auth/local/signup", {
    email: faker.internet.email(),
    password: faker.internet.password(),
  });

  userRequest = axios.create({
    adapter: axiosist.createAdapter(app),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
});

afterAll(() => connection.close());

test('GET /bookmarks unauthenticated returns a 401', async (): Promise<any> => {
  const app = makeApp();
  const res = await axiosist(app).get(`/bookmarks`);
  expect(res.status).toBe(401);
});

test('GET /bookmarks returns expected count', async (): Promise<any> => {
  const expectedCount: number = await connection.getRepository(Bookmark).count({ archived: false });
  const res = await userRequest.get(`/bookmarks`);
  expect(res.status).toBe(200);
  expect(res.data.length).toBe(expectedCount);
});

test('GET /bookmarks/:id returns expected bookmark', async (): Promise<any> => {
  const { bookmark } = await testFactory();
  const res = await userRequest.get(`/bookmarks/${bookmark.id}`);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(bookmark.id);
});


test('PUT /bookmarks/:id updates and returns expected bookmark', async (): Promise<any> => {
  const { bookmark } = await testFactory();

  const newData = {
    title: faker.lorem.words(),
  };

  const res = await userRequest.put(`/bookmarks/${bookmark.id}`, newData);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(bookmark.id);
  expect(res.data.title).toBe(newData.title);
});


test('POST /bookmarks creates and returns expected bookmark', async (): Promise<any> => {
  const newBookmark = {
    title: faker.lorem.words(),
    description: faker.lorem.sentences(),
    href: faker.internet.url(),
  };

  const res = await userRequest.post(`/bookmarks`, newBookmark);

  expect(res.status).toBe(200);
  expect(res.data.title).toBe(newBookmark.title);
  expect(res.data.description).toBe(newBookmark.description);
  expect(res.data.href).toBe(newBookmark.href);
});


test('DELETE /bookmarks/:id updates and returns 204', async (): Promise<any> => {
  const { bookmark } = await testFactory();

  // The actual delete returns a 204
  let res = await userRequest.delete(`/bookmarks/${bookmark.id}`);
  expect(res.status).toBe(204);

  // So, now 404
  try {
    await userRequest.get(`/bookmarks/${bookmark.id}`);
  } catch ({ response: { status } }) {
    expect(status).toBe(404);
  }
});
