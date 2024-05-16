import express from "express";
import { ADMIN_ROLE, CREADOR_ROLE } from "../../shared/constants/roles";
import { validateFields, validateObjectId, validateRole, validateToken } from "../../shared/middlewares/general";
import { TopicController } from "./topicController";
import { dataAdapter, validateCategoriesInTopic, validateTipicToUpdate, validateTopicItems } from "./topicMiddlewares";

const router = express.Router();

const topicController = new TopicController();

const { createTopic, getAllTopics, getOneTopic, removeTopic, updateTopic } = topicController;

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
  "/updateOne/:id",
  validateObjectId("id"),
  validateToken,
  validateRole([ADMIN_ROLE, CREADOR_ROLE]),
  validateCategoriesInTopic,
  validateTipicToUpdate,
  validateFields,
  updateTopic
);

router.post("/removeOne/:id", validateObjectId("id"), validateToken, validateRole([ADMIN_ROLE]), removeTopic);

export default router;
