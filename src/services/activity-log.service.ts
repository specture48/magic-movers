import {ActivityLog, IActivityLog, IMagicMover} from "@test/models";

/**
 * Service for managing activity logs of Magic Movers.
 */
export class ActivityLogService {
    /**
     * Creates a new activity log for a specific mover.
     * @param {IMagicMover} mover - The mover associated with the activity.
     * @param {string} action - The action performed by the mover.
     * @param {string[]} [items=[]] - The items involved in the action.
     * @param {any} session - The database session to use for the transaction.
     * @returns {Promise<IActivityLog>} - The created activity log.
     */
    async createLog(
        mover: IMagicMover,
        action: string,
        items: string[] = [],
        session: any
    ): Promise<IActivityLog> {
        const log = new ActivityLog({
            mover,
            action,
            items,
            timestamp: new Date(),
        });

        await log.save({ session });
        return log;
    }

    /**
     * Retrieves activity log
s for a specific mover, sorted by the most recent.
     * @param {string} moverId - The ID of the mover whose logs are to be fetched.
     * @returns {Promise<IActivityLog[]>} - An array of activity logs for the mover.
     */
    async getLogsByMover(moverId: string): Promise<IActivityLog[]> {
        const logs = await ActivityLog.find({ mover: moverId }).sort({ createdAt: -1 });
        return logs;
    }
}
