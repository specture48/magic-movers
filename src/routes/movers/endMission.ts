import MagicMover, {MoverStatus} from "../../models/mover";
import ActivityLog from "../../models/activity-log";

/**
 * @swagger
 * /movers/{id}/end-mission:
 *   post:
 *     summary: End a mission for a Magic Mover
 *     description: Unloads all items, updates the Magic Mover's state to "resting," increments completed missions, and creates a log entry.
 *     tags:
 *       - Magic Movers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Magic Mover
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mission ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 mover:
 *                   $ref: '#/components/schemas/Mover'
 *       400:
 *         description: Invalid state or request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mover is not currently on a mission
 *       404:
 *         description: Mover not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Magic Mover not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

export const endMission = async (req, res) => {
    const { id:moverId } = req.params;

    try {
        // Fetch the Magic Mover by ID
        const mover = await MagicMover.findById(moverId);

        if (!mover) {
            return res.status(404).json({ message: 'Magic Mover not found' });
        }

        // Ensure the Mover is currently on a mission
        if (mover.questState !== MoverStatus.ON_MISSION) {
            return res.status(400).json({ message: 'Mover is not currently on a mission' });
        }

        // Start a transaction for safe update
        const session = await MagicMover.startSession();
        session.startTransaction();

        try {
            // Unload all items and update the mover's state
            mover.currentItems = [];
            mover.questState = MoverStatus.RESTING;
            mover.missionsCompleted+=1;
            await mover.save({ session });

            // Create a log entry for ending the mission
            await ActivityLog.create(
                [
                    {
                        mover: mover,
                        action: MoverStatus.RESTING,
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
