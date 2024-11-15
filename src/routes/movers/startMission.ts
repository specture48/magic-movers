import mongoose from "mongoose";
import {MoverStatus} from "@test/models";

import container from "../../container";
import {MagicMoverService} from "../../services/magic-mover.service";
import {ActivityLogService} from "../../services/activity-log.service";
import BaseError, {ErrorTypes} from "../../types/types/error";

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
    const {id: moverId} = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Resolve services
        const magicMoverService = container.resolve<MagicMoverService>("magicMoverService");
        const activityLogService = container.resolve<ActivityLogService>("activityLogService");

        // Verify that the Magic Mover exists and is in a state that allows loading
        const mover = await magicMoverService.findById(moverId, session);
        if (!mover) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Magic Mover not found');
        }

        // Validate the current state
        if (mover.questState === MoverStatus.ON_MISSION) {
            return res.status(400).json({message: "Mover is already on a mission"});
        }

        if (mover.questState !== MoverStatus.LOADING) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Mover must be in loading state to start a mission');
        }

        mover.questState = MoverStatus.ON_MISSION;
        await Promise.all([
            magicMoverService.updateMoverState(mover.id,mover, session),
            activityLogService.createLog(mover, MoverStatus.ON_MISSION, mover.currentItems.map(item => item._id.toString()), session)
        ])

        // Commit the transaction
        await session.commitTransaction();

        return res.status(200).json({message: "Mission started successfully", mover});
    } catch (error) {
        await session.abortTransaction();
        throw error
    } finally {
        await session.endSession();
    }
};
