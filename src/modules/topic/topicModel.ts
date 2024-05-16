import mongoose, { Schema, Document } from "mongoose";

export interface TopicSchema extends Document {
  title: string;
  categories: mongoose.Types.ObjectId[];
  allowedContent: {
    image?: string;
    videoYoutube?: string;
    pdf?: string;
  };
}

const TopicSchema: Schema = new Schema({
  title: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
  allowedContent: {
    image: { type: String },
    videoYoutube: { type: String },
    pdf: { type: String },
  },
});

TopicSchema.methods.toJSON = function () {
  const { __v, _id, ...topic } = this.toObject();
  topic.id = _id;
  return topic;
};

const TopicModel = mongoose.model<TopicSchema>("Topic", TopicSchema);

export default TopicModel;
