import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICounterDocument extends Document {
  key: string;
  seq: number;
}

const CounterSchema = new Schema<ICounterDocument>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    seq: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    collection: "counters",
  }
);

const Counter: Model<ICounterDocument> =
  mongoose.models.Counter || mongoose.model<ICounterDocument>("Counter", CounterSchema);

export default Counter;
