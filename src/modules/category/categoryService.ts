import CategoryModel, { CategorySchema } from "./categoryModel";

export class CategoryService {
  constructor() {}

  async createCategory(name: string) {
    const category = new CategoryModel({ name });
    const result = await category.save();
    return result;
  }

  async getOneCategory() {
    return "category found";
  }

  async getAllCategories() {
    return "categories found";
  }

  async updateCategory(id: string, name: string) {
    const result = (await CategoryModel.findOneAndUpdate({ _id: id }, { name }, { new: true }).exec()) as CategorySchema;
    return result;
  }

  async removeCategory(id: string) {
    (await CategoryModel.findOneAndUpdate({ _id: id }, { deleted: 1 }).exec()) as CategorySchema;
    return "category removed successfully";
  }

  async resetCategory(id: string) {
    const result = (await CategoryModel.findOneAndUpdate({ _id: id }, { deleted: 0 }, { new: true }).exec()) as CategorySchema;
    return result;
  }
}

export const categoryService = new CategoryService();
