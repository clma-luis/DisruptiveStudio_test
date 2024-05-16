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

  async updateTopic(id: string, data: TopicSchema) {
    const result = await TopicModel.findOneAndUpdate({ _id: id }, { $set: { ...data } }, { new: true });
    return result;
  }

  async removeTopic(name: string) {
    return name;
  }
}

export const topicService = new TopicService();
