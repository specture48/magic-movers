import {IsNotEmpty} from "class-validator";
import mongoose from "mongoose";

import ActivityLog from "../../models/activity-log";
import MagicMover from "../../models/mover";


export class LoadMagicMoverInput{
    @IsNotEmpty()
    itemIds:string[];
}


export const loadMagicMover = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // Start transaction
    try {
        const { id: moverId } = req.params;
        const { itemIds } = req.body;

        // Verify that the Magic Mover exists and is in a state that allows loading
        const mover = await MagicMover.findById(moverId).session(session);
        if (!mover) {
            throw new Error('Magic Mover not found');
        }

        if (mover.questState !== 'resting') {
            throw new Error('Cannot load items onto a Magic Mover that is not resting');
        }

        // Update Magic Mover state and add items to it
        mover.questState = 'loading';
        mover.currentItems.push(...itemIds);
        await mover.save({ session }); // Save within the session

        // Log the loading action
        const activityLog = new ActivityLog({
            mover: mover._id, // Ensure reference to the mover
            action: 'loading',
            timestamp: new Date(),
        });
        await activityLog.save({ session }); // Save log within the session

        // Commit the transaction
        await session.commitTransaction();
        await session.endSession();

        return res.status(200).json({
            message: 'Items loaded onto Magic Mover successfully',
            mover,
            log: activityLog,
        });
    } catch (error) {
        await session.abortTransaction(); // Abort transaction on error
        await session.endSession();
        return res.status(500).json({ message: 'Error loading items', error: error.message });
    }
};
