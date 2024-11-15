import MagicMover from "../../models/mover";
import ActivityLog from "../../models/activity-log";

export const endMission = async (req, res) => {
    const { id:moverId } = req.params;

    try {
        // Fetch the Magic Mover by ID
        const mover = await MagicMover.findById(moverId);

        if (!mover) {
            return res.status(404).json({ message: 'Magic Mover not found' });
        }

        // Ensure the Mover is currently on a mission
        if (mover.questState !== 'on-mission') {
            return res.status(400).json({ message: 'Mover is not currently on a mission' });
        }

        // Start a transaction for safe update
        const session = await MagicMover.startSession();
        session.startTransaction();

        try {
            // Unload all items and update the mover's state
            mover.currentItems = [];
            mover.questState = 'resting';
            mover.missionsCompleted+=1;
            await mover.save({ session });

            // Create a log entry for ending the mission
            await ActivityLog.create(
                [
                    {
                        mover: mover,
                        action: 'resting',
                        timestamp: new Date(),
                    },
                ],
                { session }
            );

            // Commit the transaction
            await session.commitTransaction();
            await session.endSession();

            return res.status(200).json({ message: 'Mission ended successfully', mover });
        } catch (error) {
            // Rollback the transaction in case of error
            await session.abortTransaction();
            await session.endSession();
            throw error;
        }
    } catch (error) {
        console.error('Error ending mission:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
