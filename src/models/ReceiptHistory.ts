// src/models/ReceiptHistory.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IReceipt } from "@/types";

type ReceiptBase = Omit<IReceipt, "_id">;
export interface IReceiptDocument extends ReceiptBase, Document {}

const ReceiptHistorySchema = new Schema<IReceiptDocument>(
  {
    loanRecordId: {
      type: String,
      required: true,
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    memberName: { type: String, required: true },
    fatherName: { type: String, default: "" },
    loanAccountNumber: { type: String, default: "" },
    date: { type: String, required: true },
    principal: { type: Number, default: 0 },
    interest: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    amountInWords: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "receipt_history",
  }
);

ReceiptHistorySchema.index({ loanRecordId: 1 });
ReceiptHistorySchema.index({ receiptNumber: 1 }, { unique: true });
ReceiptHistorySchema.index({ createdAt: -1 }); // for date-wise filter

const ReceiptHistory: Model<IReceiptDocument> =
  mongoose.models.ReceiptHistory ||
  mongoose.model<IReceiptDocument>("ReceiptHistory", ReceiptHistorySchema);

export default ReceiptHistory;