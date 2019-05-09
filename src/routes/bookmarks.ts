import { Router } from "express";
import * as express from "express";
import { getRepository } from "typeorm";

import { Bookmark } from "../entity/Bookmark";

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

  router.get("/bookmarks", async (req, res, next) => {
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
      const bookmark = await bookmarkRepository.save(Object.assign({}, req.body, {
        user: req.user,
      }));

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
