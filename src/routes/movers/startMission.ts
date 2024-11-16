import mongoose from "mongoose";

import container from "../../container";
import {MissionService} from "../../services/mission.service";

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
        const missionService = container.resolve<MissionService>("missionService");

        await missionService.startMission(moverId,session)

        // Commit the transaction
        await session.commitTransaction();

        return res.status(200).json({message: "Mission started successfully"});
    } catch (error) {
        await session.abortTransaction();
        throw error
    } finally {
        await session.endSession();
    }
};
