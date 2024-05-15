import express from "express";
import { ADMIN_ROLE, CREADOR_ROLE } from "../../shared/constants/roles";
import { validateFields, validateObjectId, validateRole, validateToken } from "../../shared/middlewares/general";
import { TopicController } from "./topicController";
import { validateTopicItems } from "./topicMiddlewares";
import { uploadFileInCloudinary } from "../../shared/middlewares/fileMiddelwares";

const router = express.Router();

const topicController = new TopicController();

const { createTopic, getAllTopics, getOneTopic, removeTopic, updateTopic } = topicController;

router.post(
  "/create",
  validateTopicItems,
  validateFields,
  /* validateToken, validateRole([ADMIN_ROLE, CREADOR_ROLE]), */
  createTopic
);

router.get("/getAll", getAllTopics);

router.get("/getOne/:id", getOneTopic);

router.put("/updateOne/:id", validateObjectId("id"), validateToken, validateRole([ADMIN_ROLE, CREADOR_ROLE]), updateTopic);

router.post("/removeOne/:id", validateObjectId("id"), validateToken, validateRole([ADMIN_ROLE]), removeTopic);

export default router;
