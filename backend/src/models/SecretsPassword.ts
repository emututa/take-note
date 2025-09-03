

import mongoose, { Schema, Document } from "mongoose";

export interface SecretsPasswordDoc extends Document {
  passwordHash: string;
  createdAt: Date;
}

const SecretsPasswordSchema = new Schema<SecretsPasswordDoc>({
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<SecretsPasswordDoc>(
  "SecretsPassword",
  SecretsPasswordSchema
);
