import { Request, Response } from 'express';
import { IsInt, IsNotEmpty } from "class-validator";
import Mover, {MoverStatus} from "../../models/mover";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMoverInput:
 *       type: object
 *       required:
 *         - name
 *         - weightLimit
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the Magic Mover
 *         weightLimit:
 *           type: integer
 *           description: The weight limit of the Magic Mover
 *           example: 100
 *
 *   responses:
 *     CreateMoverResponse:
 *       description: Successfully created a Magic Mover
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The unique ID of the Magic Mover
 *               name:
 *                 type: string
 *                 description: The name of the Magic Mover
 *               weightLimit:
 *                 type: integer
 *                 description: The weight limit of the Magic Mover
 *               questState:
 *                 type: string
 *                 description: The current state of the Magic Mover
 *                 example: "resting"
 *
 */

export class CreateMoverInput {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsInt()
    weightLimit: number;
}

/**
 * @swagger
 * /movers:
 *   post:
 *     summary: Create a new Magic Mover
 *     tags: [Magic Movers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMoverInput'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateMoverResponse'
 *       500:
 *         description: Server error
 */
const createMover = async (req: Request, res: Response) => {
    const { name, weightLimit }: CreateMoverInput = req.body;

    try {
        const newMover = await Mover.create({
            name,
            weightLimit,
            questState: MoverStatus.RESTING
        });
        res.status(201).json({ ...newMover.toObject() });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create mover' });
    }
};

export default createMover;
