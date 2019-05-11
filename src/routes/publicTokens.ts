import { Router } from "express";
import * as express from "express";
import { getRepository } from "typeorm";

import { PublicToken } from "../entity";

export default (): Router => {
  const router = express.Router();
  const publicTokenRepository = getRepository(PublicToken);

  // Check if public token exists at all and/or for THAT user requesting
  const checkPublicTokenExists = async (req, res, next): Promise<void> => {
    try {
      if (
        (await publicTokenRepository.count({
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

  router.get("/public_tokens", async (req, res, next) => {
    try {
      const publicTokens = await publicTokenRepository.find({
        archived: false,
        user: req.user,
      });
      res.json(publicTokens);
    } catch (e) {
      next(e);
    }
  });

  router.get(
    "/public_tokens/:id",
    checkPublicTokenExists,
    async (req, res, next) => {
      try {
        res.json(
          await publicTokenRepository.findOne({
            id: req.params.id,
            archived: false,
          }),
        );
      } catch (e) {
        next(e);
      }
    },
  );

  router.post("/public_tokens", async (req, res, next) => {
    try {
      const publicToken = await publicTokenRepository.save(
        Object.assign({}, req.body, {
          user: req.user,
        }),
      );

      res.json(publicToken);
    } catch (e) {
      next(e);
    }
  });

  router.put(
    "/public_tokens/:id",
    checkPublicTokenExists,
    async (req, res, next) => {
      try {
        await publicTokenRepository.update(req.params.id, req.body);
        res.json(await publicTokenRepository.findOne(req.params.id));
      } catch (e) {
        next(e);
      }
    },
  );

  router.delete(
    "/public_tokens/:id",
    checkPublicTokenExists,
    async (req, res, next) => {
      try {
        await publicTokenRepository.update(req.params.id, { archived: true });
        res.sendStatus(204);
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
};
