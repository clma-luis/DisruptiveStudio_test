import { Request, Response } from "express";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../../shared/constants/statusHTTP";
import { topicService } from "./topicService";
import { TopicSchema } from "./topicModel";

export class TopicController {
  constructor() {}

  async createTopic(req: Request, res: Response) {
    const { title, newCategories, videoYoutube, imageCreated, pdfCreated } = req.body;
    try {
      const result = await topicService.createTopic({
        title,
        categories: newCategories,
        allowedContent: {
          image: imageCreated,
          video: videoYoutube,
          pdf: pdfCreated,
        },
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
    res.status(CREATED_STATUS).json({ message: "getAllTopic created successfully" });
  }

  async removeTopic(req: Request, res: Response) {
    res.status(CREATED_STATUS).json({ message: "removeTopic created successfully" });
  }
}
