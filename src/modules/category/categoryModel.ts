import mongoose, { Schema, Document } from "mongoose";

export interface CategorySchema extends Document {
  name: string;
  deleted?: 0 | 1;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  deleted: { type: Number, default: 0 },
});

CategorySchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
    return ret;
  },
});

const CategoryModel = mongoose.model<CategorySchema>("Category", CategorySchema);

export default CategoryModel;
