import * as faker from "faker";
import { getRepository } from "typeorm";

import { User } from "../src/entity/User";
import { Bookmark } from "../src/entity/Bookmark";
// Testing utils

// Test seeder
export const testFactory = async () => {
  const userRepository = getRepository(User);
  const user = await userRepository.save({
    name: faker.name.findName(),
    email: faker.internet.email(),
  });

  const bookmarkRepository = getRepository(Bookmark);
  const bookmark = await bookmarkRepository.save({
    title: faker.lorem.words(),
    description: faker.lorem.sentences(),
    href: faker.internet.url(),
  });

  return {
    bookmark,
    user
  };
};
