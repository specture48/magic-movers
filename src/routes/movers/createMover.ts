import { Request, Response } from 'express';

import container from "../../container";
import {CreateMoverInput} from "./inputs/create-mover.input";
import {MagicMoverService} from "../../services/magic-mover.service";

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
export const createMover = async (req: Request, res: Response) => {
    const input: CreateMoverInput = req.body;
    const moverService = container.resolve<MagicMoverService>("moverService")

    try {
        const newMover=await moverService.createMover(input)

        res.status(201).json({ ...newMover.toObject() });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create mover' });
    }
};

