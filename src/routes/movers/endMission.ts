import mongoose from "mongoose";

import container from "../../container";
import {MissionService} from "../../services/mission.service";

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
        const missionService = container.resolve<MissionService>("missionService");

        await missionService.endMission(moverId,session)

        await session.commitTransaction();

        return res.status(200).json({message: 'Mission ended successfully'});
    } catch (error) {
        session.abortTransaction(); // Abort transaction on error
        throw error
    } finally {
        session.endSession();
    }
};
