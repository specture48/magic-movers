import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
    mover: mongoose.Types.ObjectId;
    action: 'loading' | 'on-mission' | 'resting';
    items: mongoose.Types.ObjectId[];
}

const ActivityLogSchema: Schema = new Schema(
    {
        mover: { type: mongoose.Schema.Types.ObjectId, ref: 'MagicMover', required: true },
        action: { type: String, enum: ['loading', 'on-mission', 'resting'], required: true },
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MagicItem' }],
    },
    { timestamps: true }
);

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;
