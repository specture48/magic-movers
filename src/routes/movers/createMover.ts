import { Request, Response } from 'express';
import Mover from "../../models/mover";
import {IsNotEmpty} from "class-validator";

export class CreateMoverInput {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    weightLimit: number;
}

const createMover = async (req: Request, res: Response) => {
    const { name, weightLimit }: CreateMoverInput = req.body;

    try {
        const newMover = await Mover.create({
            name,
            weightLimit,
            //TODO use enum
            questState: 'resting',
        });
        res.status(201).json({...newMover});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create mover' });
    }
};

export default createMover;
