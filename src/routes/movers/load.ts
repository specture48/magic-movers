import { Request, Response } from 'express';
import mongoose from 'mongoose';

import MagicMover from "../../models/mover";
import ActivityLog from "../../models/activity-log";

export const loadMagicMover = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id:moverId } = req.params;
        const { itemIds } = req.body;

        // Verify that the Magic Mover exists and is in a state that allows loading
        const mover = await MagicMover.findById(moverId).session(session);
        if (!mover) {
            throw new Error('Magic Mover not found');
        }

        //TODO use enum
        if (mover.questState === 'resting') {
            throw new Error('Cannot load items onto a Magic Mover that is not resting');
        }

        // Update Magic Mover state and add items to it
        mover.questState = 'loading';
        mover.currentItems.push(...itemIds);
        await mover.save({ session });

        // Log the loading action
        const activityLog = new ActivityLog({
            moverId,
            transitionType: 'load',
            timestamp: new Date(),
        });
        await activityLog.save({ session });

        // Commit transaction
        await session.commitTransaction();
        await session.endSession();

        return res.status(200).json({
            message: 'Items loaded onto Magic Mover successfully',
            mover,
            log: activityLog,
        });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json({ message: 'Error loading items', error: error.message });
    }
};
