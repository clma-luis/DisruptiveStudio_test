import TopicModel, { TopicSchema } from "./topicModel";

export class TopicService {
  constructor() {}

  async createTopic(data: TopicSchema) {
    const topic = new TopicModel({ ...data });
    const result = await topic.save();
    return result;
  }

  async getOneTopic(id: string) {
    const result = (await TopicModel.findOne({ _id: id }).exec()) as TopicSchema;

    return result;
  }

  async findTopicsByCategory(categoryId: string) {
    const topics = await TopicModel.find({ categories: categoryId }).exec();
    return topics;
  }

  async getAllTopics({ page, size, category, term }: { page: number; size: number; category: string; term: string }) {
    const skip = (page - 1) * size;

    const termRegex = new RegExp(term, "i");
    const response = await TopicModel.aggregate([
      { $match: { $or: [{ title: termRegex }, { categories: category }] } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: size },
            {
              $project: {
                id: "$_id",
                title: 1,
                image: 1,
                categories: 1,
                pdf: 1,
                videoYoutube: 1,
                _id: 0,
              },
            },
          ],
          totalCount: [{ $count: "total" }],
        },
      },
    ]);

    const { data, totalCount } = response[0];

    if (!data.length) {
      const result = { data, page, total: 0, totalPages: 0 };
      return result;
    }

    const totalPages = Math.ceil(totalCount[0].total / size);
    const result = {
      data,
      page,
      total: totalCount[0].total,
      totalPages,
    };

    return result;
  }

  async updateCategoriesInTopic(id: string, data: TopicSchema, remove: TopicSchema) {
    await TopicModel.updateOne({ _id: id }, { $set: { ...data }, $unset: { ...remove } }, { new: true });
    const result = await TopicModel.findOne({ _id: id });
    return result;
  }

  async updateTopic(id: string, data: TopicSchema) {
    const result = await TopicModel.findOneAndUpdate({ _id: id }, { $set: { ...data } }, { new: true });
    return result;
  }

  async removeTopic(id: string) {
    const result = await TopicModel.deleteOne({ _id: id });
    return result;
  }
}

export const topicService = new TopicService();
