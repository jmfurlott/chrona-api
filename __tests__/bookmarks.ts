import axiosist from "axiosist";
import * as faker from "faker";

import createConnection from "../src/connection";
import makeApp from "../src/app";
import { testFactory } from "./utils";
import { Bookmark } from "../src/entity/Bookmark";


let connection;
beforeAll(async () => {
  connection = await createConnection();
});

afterAll(() => connection.close());


test('GET /bookmarks returns expected count', async (): Promise<any> => {
  const app = makeApp();

  const expectedCount: number = await connection.getRepository(Bookmark).count({ archived: false });
  const res = await axiosist(app).get(`/bookmarks`);
  expect(res.status).toBe(200);
  expect(res.data.length).toBe(expectedCount);
});


test('GET /bookmarks/:id returns expected bookmark', async (): Promise<any> => {
  const app = makeApp();
  const { bookmark } = await testFactory(connection);
  const res = await axiosist(app).get(`/bookmarks/${bookmark.id}`);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(bookmark.id);
});


test('PUT /bookmarks/:id updates and returns expected bookmark', async (): Promise<any> => {
  const app = makeApp();
  const { bookmark } = await testFactory(connection);

  const newData = {
    title: faker.lorem.words(),
  };

  const res = await axiosist(app).put(`/bookmarks/${bookmark.id}`, newData);
  expect(res.status).toBe(200);
  expect(res.data.id).toBe(bookmark.id);
  expect(res.data.title).toBe(newData.title);
});


test('POST /bookmarks creates and returns expected bookmark', async (): Promise<any> => {
  const app = makeApp();

  const newBookmark = {
    title: faker.lorem.words(),
    description: faker.lorem.sentences(),
    href: faker.internet.url(),
  };

  const res = await axiosist(app).post(`/bookmarks`, newBookmark);

  expect(res.status).toBe(200);
  expect(res.data.title).toBe(newBookmark.title);
  expect(res.data.description).toBe(newBookmark.description);
  expect(res.data.href).toBe(newBookmark.href);
});


test('DELETE /bookmarks/:id updates and returns 204', async (): Promise<any> => {
  const app = makeApp();
  const { bookmark } = await testFactory(connection);

  // The actual delete returns a 204
  let res = await axiosist(app).delete(`/bookmarks/${bookmark.id}`);
  expect(res.status).toBe(204);

  // Show now 404
  res = await axiosist(app).get(`/bookmarks/${bookmark.id}`);
  expect(res.status).toBe(404);
});
