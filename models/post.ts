import mongoose from "mongoose"

export interface IPost extends mongoose.Document {
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: mongoose.Types.ObjectId
  readTime: string
  published: boolean
  likes: number
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    readTime: { type: String, required: true },
    published: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema)

