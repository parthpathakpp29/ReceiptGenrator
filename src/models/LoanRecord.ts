// src/models/LoanRecord.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { ILoanRecord } from "@/types";

type LoanRecordBase = Omit<ILoanRecord, "_id">;
export interface ILoanRecordDocument extends LoanRecordBase, Document {}

const LoanRecordSchema = new Schema<ILoanRecordDocument>(
  {
    name: {
      type: String,
      required: [true, "Member name is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
      default: "",
    },
    loanAccountNumber: {
      type: String,
      trim: true,
      default: "",
    },
    loanStartDate: {
      type: String,
      default: "",
    },
    principal: {
      type: Number,
      default: 0,
      min: 0,
    },
    interest: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,   // adds createdAt + updatedAt automatically
    collection: "loan_records",
  }
);

// Text index for fast name search
LoanRecordSchema.index({ name: "text", fatherName: "text" });

LoanRecordSchema.index(
  { loanAccountNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { loanAccountNumber: { $type: "string", $ne: "" } },
  }
);

// Prevent model re-compilation in Next.js hot reload
const LoanRecord: Model<ILoanRecordDocument> =
  mongoose.models.LoanRecord ||
  mongoose.model<ILoanRecordDocument>("LoanRecord", LoanRecordSchema);

export default LoanRecord;