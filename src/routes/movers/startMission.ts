import mongoose from "mongoose";
import MagicMover, { MoverStatus } from "../../models/mover";
import ActivityLog from "../../models/activity-log";

/**
 * @swagger
 * /movers/{id}/start-mission:
 *   post:
 *     summary: Start a mission for a Magic Mover
 *     description: Updates the Magic Mover's state to "on-mission" and creates a log entry for the transition. The mover must be in the "loading" state to start a mission.
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
 *         description: Mission started successfully
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
 *       404:
 *         description: Mover not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export const startMission = async (req, res) => {
    const { id: moverId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the mover by ID
        const mover = await MagicMover.findById(moverId).session(session);
        if (!mover) {
            return res.status(404).json({ message: "Mover not found" });
        }

        // Validate the current state
        if (mover.questState === MoverStatus.ON_MISSION) {
            return res.status(400).json({ message: "Mover is already on a mission" });
        }

        if (mover.questState !== MoverStatus.LOADING) {
            return res.status(400).json({
                message: "Mover must be in 'loading' state to start a mission",
            });
        }

        // Update the mover's state to 'on-mission'
        mover.questState = MoverStatus.ON_MISSION;
        await mover.save({ session });

        // Log the transition
        const logEntry = new ActivityLog({
            mover,
            action: MoverStatus.ON_MISSION,
            timestamp: new Date(),
        });
        await logEntry.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        await session.endSession();

        return res.status(200).json({ message: "Mission started successfully", mover });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        console.error("Error starting mission:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
