import { Request, Response } from "express";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../../shared/constants/statusHTTP";
import { topicService } from "./topicService";
import { TopicSchema } from "./topicModel";

export class TopicController {
  constructor() {}

  async createTopic(req: Request, res: Response) {
    const { title, newCategories, allowedContentdata } = req.body;
    try {
      const result = await topicService.createTopic({
        title,
        categories: newCategories,
        ...allowedContentdata,
      } as TopicSchema);

      res.status(CREATED_STATUS).json({ message: "Topic created successfully", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while creating the topic" });
    }
  }
  async getOneTopic(req: Request, res: Response) {
    res.status(CREATED_STATUS).json({ message: "getOneTopic created successfully" });
  }
  async getAllTopics(req: Request, res: Response) {
    res.status(CREATED_STATUS).json({ message: "getAllTopic created successfully" });
  }

  async updateCategoriesInTopic(req: Request, res: Response) {
    const { newCategories, dataToSend, dataToRemove } = req.body;

    console.log({ dataToRemove });

    const { _id, __v, categories, ...rest } = dataToSend;

    const { id } = req.params;
    try {
      const result = await topicService.updateCategoriesInTopic(id, { categories: newCategories, ...rest }, dataToRemove);
      res.status(CREATED_STATUS).json({ message: "updateCategoriesInTopic created successfully", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while updating the topic" });
    }
  }

  async updateTopic(req: Request, res: Response) {
    try {
      const { tokenRole, user, categories, newCategories, ...rest } = req.body;

      const result = await topicService.updateTopic(req.params.id, { categories: newCategories, ...rest } as TopicSchema);
      res.status(CREATED_STATUS).json({ message: "getAllTopic created successfully", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while updating the topic" });
    }
  }

  async removeTopic(req: Request, res: Response) {
    res.status(CREATED_STATUS).json({ message: "removeTopic created successfully" });
  }
}
