import mongoose, { Document, Schema } from 'mongoose';

export interface IMagicItem extends Document {
    name: string;
    weight: number;
}

const MagicItemSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        weight: { type: Number, required: true },
    },
    { timestamps: true }
);

export const MagicItem = mongoose.model<IMagicItem>('MagicItem', MagicItemSchema);
