import { IMagicMover, MagicMover, MoverStatus } from "@test/models";
import { CreateMoverInput } from "../routes/movers/inputs/create-mover.input";

/**
 * Service for managing Magic Movers.
 */
export class MagicMoverService {
    /**
     * Creates a new Magic Mover with the given data.
     * @param {CreateMoverInput} data - The data for creating a new mover.
     * @returns {Promise<IMagicMover>} - The newly created mover.
     */
    async createMover(data: CreateMoverInput): Promise<IMagicMover> {
        const newMover = await MagicMover.create({
            ...data,
            questState: MoverStatus.RESTING,
        });
        await newMover.save();
        return newMover;
    }

    /**
     * Finds a mover by its ID.
     * @param {string} moverId - The ID of the mover to find.
     * @param {any} session - The database session to use.
     * @returns {Promise<IMagicMover | null>} - The found mover or null if not found.
     */
    async findById(moverId: string, session: any): Promise<IMagicMover | null> {
        return MagicMover.findById(moverId).session(session);
    }

    /**
     * Updates an existing mover with the provided data.
     * @param {string} id - The ID of the mover to update.
     * @param {IMagicMover} mover - The mover data to update.
     * @param {any} session - The database session to use.
     * @returns {Promise<IMagicMover>} - The updated mover.
     */
    async updateMover(id: string, mover: IMagicMover, session: any): Promise<IMagicMover> {
        await mover.save({ session });
        return mover;
    }

    /**
     * Retrieves all movers sorted by the number of missions they have completed.
     * @returns {Promise<IMagicMover[]>} - A list of movers sorted by missions completed in descending order.
     */
    async getMoversByMissionCount(): Promise<IMagicMover[]> {
        return MagicMover.find().sort({ missionsCompleted: -1 });
    }
}
