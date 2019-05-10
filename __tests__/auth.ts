import * as axiosist from "axiosist";
import axios from "axios";
import { AxiosInstance, AxiosResponse } from "axios";
import { Connection } from "typeorm";
import * as faker from "faker";

import createConnection from "../src/connection";
import makeApp from "../src/app";
import { testFactory } from "./utils";
import { Bookmark, PublicToken, User } from "../src/entity";


let app: any;
let connection: Connection;
let user: User;
let userRequest: AxiosInstance;
beforeAll(async () => {
  connection = await createConnection();
  // Login and generate a token
  app = makeApp();
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

test('POST /auth/local/signup and logins succesfully', async (): Promise<any> => {
  const app = makeApp();

  const formData = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  let res = await axiosist(app).post(`/auth/local/signup`, formData);
  expect(res.status).toBe(200);
  expect(res.data.email).toBe(formData.email);
  expect(res.data.encryptedPassword).toBeTruthy();

  res = await axiosist(app).post(`/auth/local/login`, formData);
  expect(res.status).toBe(200);
  expect(res.data.email).toBe(formData.email);
  expect(res.data.encryptedPassword).toBeTruthy();
});


test.skip("TODO POST login with missing account returns error", async (): Promise<any> => {

});

test.skip("TODO POST login with incorrect password returns error", async (): Promise<any> => {

});

/* Public tokens */
test("User can generate public token", async (): Promise<any> => {
  const res: AxiosResponse = await userRequest.post("/public_tokens", {});
  expect(res.status).toBe(200); // NOTE send 201 for Created?
});

test("User can get public tokens", async (): Promise<any> => {
  const res: AxiosResponse = await userRequest.get("/public_tokens", {});
  expect(res.status).toBe(200);

  const observedPublicTokens: PublicToken[] = res.data;

  const expectedPublicTokens: PublicToken[] = await connection.getRepository(PublicToken).find({
    user: user,
    archived: false
  });

  expect(observedPublicTokens.length).toBe(expectedPublicTokens.length);
});

test("User can read-only GET bookmarks with /bookmarks?token={token}", async (): Promise<any> => {
  // Create some bookmarks
  const newBookmark = {
    title: faker.lorem.words(),
    description: faker.lorem.sentences(),
    href: faker.internet.url(),
  };
  await userRequest.post(`/bookmarks`, newBookmark);

  // Now, create a public token
  let res: AxiosResponse = await userRequest.post("/public_tokens", {});

  // Take any token there might be; know for sure there is at least one here ^
  const [publicToken]: [PublicToken] = res.data;

  // NOTE this is using axiosist, not userRequest
  res = await axiosist(app).get(`/bookmarks?publicToken=${publicToken.id}`);
  expect(res.status).toBe(200);

  const observedBookmarks: Bookmark[] = res.data;

  // Get existing bookmarks straight from the db
  const expectedBookmarks: Bookmark[] = await connection.getRepository(Bookmark).find({
    user: user,
    archived: false
  });

  expect(observedBookmarks.length).toBe(expectedBookmarks.length);
});

test("User cannot read-only GET bookmarks with an invalid token on /bookmarks?token={token}", async (): Promise<any> => {
  const randomToken = faker.random.uuid();

  // NOTE this is using axiosist, not userRequest
  const res = await axiosist(app).get(`/bookmarks?publicToken=${randomToken}`);
  expect(res.status).toBe(403); // Forbidden
});

test.skip("TODO User cannot edit bookmarks with /bookmarks?token={token}", async (): Promise<any> => {

});
