import { Router } from "express";
import * as express from "express";
import { getRepository } from "typeorm";

import { User } from "./entity/User";

export default (): Router => {
  const router = express.Router();
  const userRepository = getRepository(User);

  router.get("/users", async (req, res, next) => {
    try {
      res.json(await userRepository.find());
    } catch (e) {
      next(e);
    }
  });

  router.get("/users/:id", async (req, res, next) => {
    try {
      if (await userRepository.count({ id: req.params.id, archived: false }) === 0) {
        res.sendStatus(404);
      }
      res.json(await userRepository.findOne({ id: req.params.id, archived: false }));
    } catch (e) {
      next(e);
    }
  });

  router.post("/users", async (req, res, next) => {
    try {
      res.json(await userRepository.save(req.body));
    } catch (e) {
      next(e);
    }
  });

  router.put("/users/:id", async (req, res, next) => {
    try {
      await userRepository.update(req.params.id, req.body);
      res.json(await userRepository.findOne(req.params.id));
    } catch (e) {
      next(e);
    }
  });

  router.delete("/users/:id", async (req, res, next) => {
    try {
      await userRepository.update(req.params.id, { archived: true });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });

  return router;
};
