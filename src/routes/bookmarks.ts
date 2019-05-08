import { Router } from "express";
import * as express from "express";
import { getRepository } from "typeorm";

import { Bookmark } from "../entity/Bookmark";

export default (): Router => {
  const router = express.Router();
  const bookmarkRepository = getRepository(Bookmark);

  const checkBookmarkExists = async (req, res, next): Promise<void> => {
    try {
      if (
        (await bookmarkRepository.count({ id: req.params.id, archived: false })) ===
        0
      ) {
        res.sendStatus(404);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  router.get("/bookmarks", async (req, res, next) => {
    try {
      res.json(await bookmarkRepository.find({ archived: false }));
    } catch (e) {
      next(e);
    }
  });

  router.get("/bookmarks/:id", checkBookmarkExists, async (req, res, next) => {
    try {
      res.json(
        await bookmarkRepository.findOne({ id: req.params.id, archived: false }),
      );
    } catch (e) {
      next(e);
    }
  });

  router.post("/bookmarks", async (req, res, next) => {
    try {
      res.json(await bookmarkRepository.save(req.body));
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

  router.delete("/bookmarks/:id", checkBookmarkExists, async (req, res, next) => {
    try {
      await bookmarkRepository.update(req.params.id, { archived: true });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });

  return router;
};
