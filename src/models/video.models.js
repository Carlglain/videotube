import mongoose, { Schema, model } from "mongoose";

const videoSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Video = model("Video", videoSchema);
