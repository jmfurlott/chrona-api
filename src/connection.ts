import { createConnection, Connection } from "typeorm";

import {
  Bookmark,
  PublicToken,
  User,
} from "./entity";

export default (): Promise<Connection> => createConnection({
  type: "postgres",
  host: process.env.BOOKMARKS_DB_HOST,
  port: 5432,
  username: process.env.BOOKMARKS_DB_USERNAME,
  password: process.env.BOOKMARKS_DB_PASSWORD,
  database: process.env.BOOKMARKS_DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    Bookmark,
    PublicToken,
    User,
  ]
});
