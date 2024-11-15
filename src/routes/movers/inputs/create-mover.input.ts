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
import {IsInt, IsNotEmpty} from "class-validator";

export class CreateMoverInput {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsInt()
    weightLimit: number;
}