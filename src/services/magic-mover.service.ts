import {IMagicMover, MagicMover, MoverStatus} from "@test/models";
import {CreateMoverInput} from "../routes/movers/inputs/create-mover.input";

export class MagicMoverService {
    async createMover(data:CreateMoverInput) {
        const newMover = await MagicMover.create({
            ...data,
            questState: MoverStatus.RESTING
        });
        await newMover.save();
        return newMover;
    }

    async findById(moverId: string, session: any) {
        return MagicMover.findById(moverId).session(session);
    }

    async updateMoverState(id:string,mover: IMagicMover,  session: any) {
        // mover.questState = state;
        // mover.currentItems.push(...itemIds);
        await mover.save({ session });
        return mover;
    }

    async getMoversByMissionCount() {
        return MagicMover.find().sort({ missionsCompleted: -1 });
    }
}
