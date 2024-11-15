import {ArrayMinSize, IsArray, IsNotEmpty} from "class-validator";
import mongoose from "mongoose";
import {MoverStatus} from "@test/models";

import container from "../../container";
import {MagicMoverService} from "../../services/magic-mover.service";
import {MagicItemService} from "../../services/item.service";
import BaseError, {ErrorTypes} from "../../types/types/error";

export class LoadMagicMoverInput {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
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
 *                 mover:
 *                   $ref: '#/components/schemas/Mover'
 *                 log:
 *                   $ref: '#/components/schemas/ActivityLog'
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
        const magicMoverService = container.resolve<MagicMoverService>("magicMoverService");
        const activityLogService = container.resolve("activityLogService");

        // Verify that the Magic Mover exists and is in a state that allows loading
        const mover = await magicMoverService.findById(moverId, session);
        if (!mover) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Magic Mover not found');
        }

        await validateWeightLimit(itemIds, mover.weightLimit);

        if (mover.questState !== MoverStatus.RESTING) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Cannot load items onto a Magic Mover that is not resting');
        }

        mover.questState = MoverStatus.LOADING;
        const [updatedMover, activityLog] = await Promise.all([
            magicMoverService.updateMoverState(mover.id,mover, session),
            activityLogService.createLog(mover, MoverStatus.LOADING, mover.currentItems.map(item => item._id.toString()), session)
        ])

        // Commit the transaction
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

const validateWeightLimit = async (itemIds: string[], weightLimit: number): Promise<void> => {
    const magicItemService = container.resolve<MagicItemService>("magicItemService");
    const items = await magicItemService.findByIds(itemIds);

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight > weightLimit) {
        throw new Error(`Total weight of items (${totalWeight}) exceeds the allowed limit of ${weightLimit}`);
    }
};
