import mongoose, { Schema, Document } from "mongoose";

export interface TopicSchema extends Document {
  title: string;
  categories: mongoose.Types.ObjectId[];
  image?: string;
  videoYoutube?: string;
  pdf?: string;
}

const TopicSchema: Schema = new Schema({
  title: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
  image: { type: String },
  videoYoutube: { type: String },
  pdf: { type: String },
});

TopicSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const TopicModel = mongoose.model<TopicSchema>("Topic", TopicSchema);

export default TopicModel;
