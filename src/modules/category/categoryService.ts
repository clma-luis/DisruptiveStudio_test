import mongoose from "mongoose";
import TopicModel from "../topic/topicModel";
import CategoryModel, { CategorySchema } from "./categoryModel";

export class CategoryService {
  constructor() {}

  async createCategory(name: string) {
    const category = new CategoryModel({ name });
    const result = await category.save();
    return result;
  }

  async getOneCategory(id: string) {
    const result = (await CategoryModel.findOne({ _id: id })) as CategorySchema;

    return result;
  }

  async getAllCategories() {
    const result = await CategoryModel.find().exec();
    return result;
  }

  async updateCategory(id: string, name: string) {
    const result = (await CategoryModel.findOneAndUpdate({ _id: id }, { name }, { new: true }).exec()) as CategorySchema;
    return result;
  }

  async removeCategory(id: string, data: CategorySchema) {
    const name = data.name;
    const categoryPromise = CategoryModel.findOneAndDelete({ _id: id }).exec();
    const topicPromise = TopicModel.updateMany(
      { categories: mongoose.Types.ObjectId.createFromHexString(id) },
      {
        $pull: { categories: mongoose.Types.ObjectId.createFromHexString(id) },
        $unset: { [name]: "" },
      }
    ).exec();

    const [category, topic] = await Promise.all([categoryPromise, topicPromise]);
    return { category, topic };
  }

  async resetCategory(id: string) {
    const result = (await CategoryModel.findOneAndUpdate({ _id: id }, { deleted: 0 }, { new: true }).exec()) as CategorySchema;
    return result;
  }
}

export const categoryService = new CategoryService();
