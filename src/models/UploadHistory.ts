import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUploadHistoryDocument extends Document {
  fileName: string;
  totalParsed: number;
  inserted: number;
  updated: number;
  status: "success" | "failed";
  errorMessage?: string;
}

const UploadHistorySchema = new Schema<IUploadHistoryDocument>(
  {
    fileName: { type: String, required: true, trim: true },
    totalParsed: { type: Number, default: 0, min: 0 },
    inserted: { type: Number, default: 0, min: 0 },
    updated: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    errorMessage: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "upload_history",
  }
);

UploadHistorySchema.index({ createdAt: -1 });

const UploadHistory: Model<IUploadHistoryDocument> =
  mongoose.models.UploadHistory ||
  mongoose.model<IUploadHistoryDocument>("UploadHistory", UploadHistorySchema);

export default UploadHistory;
