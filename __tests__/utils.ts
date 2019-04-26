import * as faker from "faker";

import { User } from "../src/entity/User";
import { Bookmark } from "../src/entity/Bookmark";
// Testing utils

// Test seeder
export const testFactory = async (connection) => {
  const user = await connection.manager.save(connection.manager.create(User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    github_id: faker.random.uuid(),
  }));


  const bookmark = await connection.manager.save(connection.manager.create(Bookmark, {
    title: faker.lorem.words(),
    description: faker.lorem.sentences(),
    href: faker.internet.url(),
  }));


  return {
    user
  };
};

