import { Router } from "express";
import * as express from "express";
import { getRepository } from "typeorm";

import { Bookmark, PublicToken } from "../entity";

export const checkPublicToken = async (req, res, next): Promise<void> => {
  try {
    const {
      method,
      url,
      query: { publicToken },
    } = req;
    if (
      method === "GET" &&
      url.match(/\/bookmarks/) &&
      publicToken !== undefined
    ) {
      // We have a token for only GET /bookmarks but have not validated it
      // NOTE better name needed than return value ha
      const [rv] = await getRepository(PublicToken).find({
        relations: ["user"],
        where: [{ id: publicToken, archived: false }],
      });

      if (rv) {
        // Fetch the necessary bookmarks
        const bookmarks = await getRepository(Bookmark).find({
          archived: false,
          user: rv.user,
        });

        // Go ahead and return bookmarks
        res.json(bookmarks);
      } else {
        // Attempted but forbidden!
        res.sendStatus(403);
      }
    } else {
      // Carry on to regular JWT'ing, as there is nothing public about this route
      next();
    }
  } catch (e) {
    // Caught for any arbitrary errors
    next(e);
  }
};

export default (): Router => {
  const router = express.Router();
  const bookmarkRepository = getRepository(Bookmark);

  // Check if bookmark exists at all and/or for THAT user requesting
  const checkBookmarkExists = async (req, res, next): Promise<void> => {
    try {
      if (
        (await bookmarkRepository.count({
          id: req.params.id,
          archived: false,
          user: req.user,
        })) === 0
      ) {
        res.sendStatus(404);
      } else {
        next();
      }
    } catch (e) {
      next(e);
    }
  };

  router.get("/bookmarks", checkPublicToken, async (req, res, next) => {
    try {
      const bookmarks = await bookmarkRepository.find({
        archived: false,
        user: req.user,
      });
      res.json(bookmarks);
    } catch (e) {
      next(e);
    }
  });

  router.get("/bookmarks/:id", checkBookmarkExists, async (req, res, next) => {
    try {
      res.json(
        await bookmarkRepository.findOne({
          id: req.params.id,
          archived: false,
        }),
      );
    } catch (e) {
      next(e);
    }
  });

  router.post("/bookmarks", async (req, res, next) => {
    try {
      const bookmark = await bookmarkRepository.save(
        Object.assign({}, req.body, {
          user: req.user,
        }),
      );

      res.json(bookmark);
    } catch (e) {
      next(e);
    }
  });

  router.put("/bookmarks/:id", checkBookmarkExists, async (req, res, next) => {
    try {
      await bookmarkRepository.update(req.params.id, req.body);
      res.json(await bookmarkRepository.findOne(req.params.id));
    } catch (e) {
      next(e);
    }
  });

  router.delete(
    "/bookmarks/:id",
    checkBookmarkExists,
    async (req, res, next) => {
      try {
        await bookmarkRepository.update(req.params.id, { archived: true });
        res.sendStatus(204);
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
};
