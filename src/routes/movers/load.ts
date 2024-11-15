import {ArrayMinSize, IsArray, IsNotEmpty} from "class-validator";
import mongoose from "mongoose";

import ActivityLog from "../../models/activity-log";
import MagicMover, {MoverStatus} from "../../models/mover";


export class LoadMagicMoverInput{
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    itemIds:string[];
}

//TODO validate the weight limit

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
        const { id: moverId } = req.params;
        const { itemIds } = req.body;

        // Verify that the Magic Mover exists and is in a state that allows loading
        const mover = await MagicMover.findById(moverId).session(session);
        if (!mover) {
            throw new Error('Magic Mover not found');
        }

        if (mover.questState !== MoverStatus.RESTING) {
            throw new Error('Cannot load items onto a Magic Mover that is not resting');
        }

        // Update Magic Mover state and add items to it
        mover.questState = MoverStatus.LOADING;
        mover.currentItems.push(...itemIds);
        //TODO check the awaits maybe we can combine some to improve performance
        await mover.save({ session }); // Save within the session

        // Log the loading action
        const activityLog = new ActivityLog({
            mover: mover._id, // Ensure reference to the mover
            action: MoverStatus.LOADING,
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
