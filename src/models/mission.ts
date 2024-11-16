import mongoose, { Document, Schema } from 'mongoose';

export interface IMission extends Document {
    mover: mongoose.Types.ObjectId;
    items: mongoose.Types.ObjectId[];
}

const MissionSchema: Schema = new Schema(
    {
        mover: { type: mongoose.Schema.Types.ObjectId, ref: 'MagicMover', required: true },
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MagicItem' }],
        //TODO add started_at,completed_at both nullable
    },
    { timestamps: true }
);

export const Mission = mongoose.model<IMission>('Mission', MissionSchema);
