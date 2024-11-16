import {ArrayMinSize, IsArray, IsMongoId, IsNotEmpty} from "class-validator";
import mongoose from "mongoose";

import container from "../../container";
import {MagicMoverService} from "../../services/magic-mover.service";
import {MagicItemService} from "../../services/magic-item.service";
import {MissionService} from "../../services/mission.service";

export class LoadMagicMoverInput {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({each: true})
    itemIds: string[];
}

/**
 * @swagger
 * /movers/{id}/load:
 *   post:
 *     summary: Load items onto a Magic Mover
 *     description: Load a list of item IDs onto a Magic Mover while updating its state to `loading` and logging the action.
 *     tags:
 *       - Magic Movers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Magic Mover to load items onto.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of item IDs to load onto the Magic Mover.
 *             required:
 *               - itemIds
 *     responses:
 *       200:
 *         description: Items loaded successfully onto the Magic Mover.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Items loaded onto Magic Mover successfully
 *       400:
 *         description: Validation error or invalid mover state.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot load items onto a Magic Mover that is not resting
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error loading items
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */

export const loadMagicMover = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // Start transaction

    try {
        const {id: moverId} = req.params;
        const {itemIds} = req.body as LoadMagicMoverInput;

        // Resolve services
        const missionService = container.resolve<MissionService>("missionService");

        await missionService.load(moverId,itemIds,session)

        await session.commitTransaction();

        return res.status(200).json({
            message: 'Items loaded onto Magic Mover successfully',
        });
    } catch (error) {
        session.abortTransaction(); // Abort transaction on error
        throw error
    } finally {
        session.endSession(); // Always end the session
    }
};

