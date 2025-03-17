import mongoose from "mongoose"

export interface IProject extends mongoose.Document {
  title: string
  slug: string
  description: string
  fullDescription: string
  image: string
  gallery: string[]
  tags: string[]
  github: string
  demo: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    fullDescription: { type: String, required: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    tags: [{ type: String }],
    github: { type: String },
    demo: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)

