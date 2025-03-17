import mongoose from "mongoose"

export interface IComment extends mongoose.Document {
  post: mongoose.Types.ObjectId
  author: mongoose.Types.ObjectId
  content: string
  likes: number
  parent?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true },
)

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema)

