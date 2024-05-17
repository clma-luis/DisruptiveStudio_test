import express from "express";
import { ADMIN_ROLE, CREADOR_ROLE } from "../../shared/constants/roles";
import { validateFields, validateObjectId, validateRole, validateToken } from "../../shared/middlewares/general";
import { TopicController } from "./topicController";
import {
  cleanDocument,
  dataAdapter,
  validateCategoriesInTopic,
  validateIfExistTopic,
  validateTopicToUpdate,
  validateTopicItems,
} from "./topicMiddlewares";

const router = express.Router();

const topicController = new TopicController();

const { createTopic, getAllTopics, getOneTopic, removeTopic, updateCategoriesInTopic, updateTopic } = topicController;

router.post(
  "/create",
  validateToken,
  validateRole([ADMIN_ROLE, CREADOR_ROLE]),
  validateCategoriesInTopic,
  validateTopicItems,
  validateFields,
  dataAdapter,
  createTopic
);

router.get("/getAll", getAllTopics);

router.get("/getOne/:id", getOneTopic);

router.put(
  "/updateCategoriesInTopic/:id",
  validateObjectId("id"),
  validateIfExistTopic,
  validateToken,
  validateRole([ADMIN_ROLE, CREADOR_ROLE]),
  validateCategoriesInTopic,
  cleanDocument,
  updateCategoriesInTopic
);

router.put(
  "/updateOne/:id",
  validateObjectId("id"),
  validateIfExistTopic,
  validateToken,
  validateRole([ADMIN_ROLE, CREADOR_ROLE]),
  validateTopicToUpdate,
  validateFields,
  updateTopic
);

router.post("/removeOne/:id", validateObjectId("id"), validateIfExistTopic, validateToken, validateRole([ADMIN_ROLE]), removeTopic);

export default router;
