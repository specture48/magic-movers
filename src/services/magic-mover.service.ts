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
     * Fetches a paginated list of movers sorted by the number of completed missions.
     *
     * This function retrieves movers with a specified limit and offset for pagination. It also provides the total number of movers available in the system.
     *
     * @param {number} offset - The number of items to skip, used for pagination.
     * @param {number} limit - The maximum number of items to return per page.
     *
     * @returns {Promise<{ movers: Array, total: number }>} A promise that resolves to an object containing:
     *   - `movers`: An array of mover objects sorted by the number of completed missions (in descending order).
     *   - `total`: The total count of movers in the database, without pagination.
     *
     * @throws {Error} If an error occurs while fetching the movers, an error will be thrown.
     */
    async getPaginatedMovers(offset:number, limit:number): Promise<{ movers: Array<any>; total: number; }> {
            const movers = await MagicMover.find()
                .sort({ missionsCompleted: -1 })
                .limit(limit)
                .skip(offset);

            // Get total count of movers (without pagination)
            const total = await MagicMover.countDocuments();

            return { movers, total };
    }

}
