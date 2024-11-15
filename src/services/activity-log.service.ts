import {ActivityLog, IMagicMover} from "@test/models";

export  class ActivityLogService {
    async createLog(mover: IMagicMover, action: string, items: string[] = [],session:any) {
        const log = new ActivityLog({
            mover: mover,
            action,
            items,
            timestamp: new Date(),
        });

        await log.save({ session });
        return log;
    }

    /**
     * Retrieve activity logs for a specific mover.
     * @param moverId - The ID of the mover whose logs are to be fetched.
     * @returns An array of activity logs.
     */
    async getLogsByMover(moverId: string) {
        const logs = await ActivityLog.find({ mover: moverId }).sort({ createdAt: -1 });
        return logs;
    }
}
