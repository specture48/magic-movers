import mongoose from "mongoose";

import {MoverStatus} from "@test/models";
import BaseError, {ErrorTypes} from "../../types/types/error";
import container from "../../container";
import {MagicMoverService} from "../../services/magic-mover.service";
import {ActivityLogService} from "../../services/activity-log.service";

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
    const {id: moverId} = req.params;
    const session = await mongoose.startSession();
    session.startTransaction(); // Start transaction

    try {
        const magicMoverService = container.resolve<MagicMoverService>("magicMoverService");
        const activityLogService = container.resolve<ActivityLogService>("activityLogService");

        // Verify that the Magic Mover exists and is in a state that allows loading
        const mover = await magicMoverService.findById(moverId, session);
        if (!mover) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Magic Mover not found');
        }

        // Ensure the Mover is currently on a mission
        if (mover.questState !== MoverStatus.ON_MISSION) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Mover is not currently on a mission');
        }

        mover.currentItems = [];
        mover.questState = MoverStatus.RESTING;
        mover.missionsCompleted += 1;

        await Promise.all([
            magicMoverService.updateMover(mover.id, mover, session),
            activityLogService.createLog(mover, MoverStatus.RESTING, mover.currentItems.map(item => item._id.toString()), session)
        ])

        // Commit the transaction
        await session.commitTransaction();

        return res.status(200).json({message: 'Mission ended successfully', mover});
    } catch (error) {
        console.error('Error ending mission:', error);
        session.abortTransaction(); // Abort transaction on error

        throw error
    } finally {
        session.endSession();
    }
};
