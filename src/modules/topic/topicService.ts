import TopicModel, { TopicSchema } from "./topicModel";

export class TopicService {
  constructor() {}

  async createTopic(data: TopicSchema) {
    const topic = new TopicModel({ ...data });
    const result = await topic.save();
    return result;
  }

  async getOneTopic(name: string) {
    return name;
  }

  async getAllTopics(name: string) {
    return name;
  }

  async updateTopic(name: string) {
    return name;
  }

  async removeTopic(name: string) {
    return name;
  }
}

export const topicService = new TopicService();
