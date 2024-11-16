import mongoose, { Document, Schema } from 'mongoose';

export enum MoverStatus {
    RESTING='resting',
    LOADING='loading',
    ON_MISSION='on-mission',
}

export interface IMagicMover extends Document {
    name: string;
    weightLimit: number;
    questState: 'resting' | 'loading' | 'on-mission';
    currentItems: mongoose.Types.ObjectId[];
    missionsCompleted: number;
}

const MagicMoverSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        weightLimit: { type: Number, required: true },
        questState: {
            type: String,
            enum: Object.values(MoverStatus),
            default: 'resting',
            required: true,
        },
        currentItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MagicItem' }],
        missionsCompleted: { type: Number, default: 0, index: true }, // Indexed for frequent queries
    },
    { timestamps: true }
);


export const MagicMover = mongoose.model<IMagicMover>('MagicMover', MagicMoverSchema);
