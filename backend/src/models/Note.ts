



// src/models/Note.ts
import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  category: "personal" | "work" | "secrets" | "favourite";
  color?: string;
  fontSize?: string;
  tags?: string[];
  audioUrl?: string;   // Optional field for audio URL
  summary?: string;    // Optional field for OpenAI-generated summary
}

const NoteSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["personal", "work", "secrets", "favourite"],
      required: true,
    },
    color: String,
    fontSize: String,
    tags: [String],
    audioUrl: String,
    summary: String, // Optional summary
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
