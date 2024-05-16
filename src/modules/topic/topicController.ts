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
        allowedContent: allowedContentdata,
      } as TopicSchema);

      res.status(CREATED_STATUS).json({ message: "Topic created successfully", result });
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while creating the topic" });
    }
  }
  async getOneTopic(req: Request, res: Response) {
    res.status(CREATED_STATUS).json({ message: "getOneTopic created successfully" });
  }
  async getAllTopics(req: Request, res: Response) {
    res.status(CREATED_STATUS).json({ message: "getAllTopic created successfully" });
  }

  async updateTopic(req: Request, res: Response) {
    try {
      const { tokenRole, user, categories, newCategories, ...rest } = req.body;
      console.log(rest.categories);
      const result = await topicService.updateTopic(req.params.id, { categories: newCategories, ...rest } as TopicSchema);
      res.status(CREATED_STATUS).json({ message: "getAllTopic created successfully", result });
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while updating the topic" });
    }
  }

  async removeTopic(req: Request, res: Response) {
    res.status(CREATED_STATUS).json({ message: "removeTopic created successfully" });
  }
}
