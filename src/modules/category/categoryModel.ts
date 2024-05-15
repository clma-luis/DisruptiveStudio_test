import mongoose, { Schema, Document } from "mongoose";

export interface CategorySchema extends Document {
  name: string;
  deleted?: 0 | 1;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  deleted: { type: Number, default: 0 },
});

CategorySchema.methods.toJSON = function () {
  const { __v, _id, deleted, ...category } = this.toObject();
  category.id = _id.toString();
  return category;
};

const CategoryModel = mongoose.model<CategorySchema>("Category", CategorySchema);

export default CategoryModel;
