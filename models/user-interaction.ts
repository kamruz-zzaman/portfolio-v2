import mongoose from "mongoose"

export interface IUserInteraction extends mongoose.Document {
  user: mongoose.Types.ObjectId
  post?: mongoose.Types.ObjectId
  comment?: mongoose.Types.ObjectId
  type: "like" | "dislike" | "view" | "share"
  createdAt: Date
}

const UserInteractionSchema = new mongoose.Schema<IUserInteraction>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    type: {
      type: String,
      enum: ["like", "dislike", "view", "share"],
      required: true,
    },
  },
  { timestamps: true },
)

// Ensure a user can only have one interaction of each type per post/comment
UserInteractionSchema.index(
  { user: 1, post: 1, type: 1 },
  { unique: true, partialFilterExpression: { post: { $exists: true } } },
)

UserInteractionSchema.index(
  { user: 1, comment: 1, type: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } },
)

export default mongoose.models.UserInteraction ||
  mongoose.model<IUserInteraction>("UserInteraction", UserInteractionSchema)

