import { Schema, model, models, Types } from "mongoose";
import { User } from "./User";

const commentSchema = new Schema(
  {
    text: { type: String },
    uploads: { type: [String] },
    userEmail: { type: String, required: true, ref: "User" },
    feedbackId: { type: Types.ObjectId, required: true },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

commentSchema.virtual("user", {
  ref: User,
  localField: "userEmail",
  foreignField: "email",
  justOne: true,
});

export const Comment = models?.Comment || model("Comment", commentSchema);
