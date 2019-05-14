import * as axiosist from "axiosist";
import axios from "axios";
import { AxiosInstance } from "axios";
import { Connection } from "typeorm";
import * as faker from "faker";

import createConnection from "../src/connection";
import makeApp from "../src/app";
import { testFactory } from "./utils";
import { Bookmark } from "../src/entity/Bookmark";
import { User } from "../src/entity/User";


let connection: Connection;
let userRequest: AxiosInstance;
let user: User;
beforeAll(async () => {
  connection = await createConnection();

  // Login and generate a token
  const app = makeApp();
  const { data: { token, id } } = await axiosist(app).post("/auth/local/signup", {
    email: faker.internet.email(),
    password: faker.internet.password(),
  });

  user = await connection.getRepository(User).findOne(id);

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
  const newBookmark = {
    title: faker.lorem.words(),
    description: faker.lorem.sentences(),
    href: faker.internet.url(),
  };
  await userRequest.post(`/bookmarks`, newBookmark);

  const bookmarks: Bookmark[] = await connection.getRepository(Bookmark).find({
    user: user,
    archived: false
  });

  const res = await userRequest.get(`/bookmarks`);
  expect(res.status).toBe(200);
  expect(res.data.length).toBe(bookmarks.length);
});

test('GET /bookmarks/:id returns expected bookmark', async (): Promise<any> => {
  const newBookmark = {
    title: faker.lorem.words(),
    description: faker.lorem.sentences(),
    href: faker.internet.url(),
  };

  const { data: { id } } = await userRequest.post(`/bookmarks`, newBookmark);
  const res = await userRequest.get(`/bookmarks/${id}`);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(id);
});


test('GET /bookmarks/:id if not created by user returns 404', async (): Promise<any> => {
  try {
    const { bookmark } = await testFactory();
    await userRequest.get(`/bookmarks/${bookmark.id}`);
  } catch ({ response: { status } }) {
    expect(status).toBe(404);
  }
});


test('PUT /bookmarks/:id updates and returns expected bookmark', async (): Promise<any> => {
  const newBookmark = {
    title: faker.lorem.words(),
    description: faker.lorem.sentences(),
    href: faker.internet.url(),
  };

  const { data: { id } } = await userRequest.post(`/bookmarks`, newBookmark);

  const newData = {
    title: faker.lorem.words(),
  };

  const res = await userRequest.put(`/bookmarks/${id}`, newData);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(id);
  expect(res.data.title).toBe(newData.title);
});


test('PUT /bookmarks/:id on another user returns error', async (): Promise<any> => {
  try {
    const { bookmark } = await testFactory();
    const newData = {
      title: faker.lorem.words(),
    };

    await userRequest.put(`/bookmarks/${bookmark.id}`, newData);
  } catch ({ response: { status } }) {
    expect(status).toBe(404);
  }
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
  const newBookmark = {
    title: faker.lorem.words(),
    description: faker.lorem.sentences(),
    href: faker.internet.url(),
  };
  const { data: bookmark } = await userRequest.post(`/bookmarks`, newBookmark);

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
