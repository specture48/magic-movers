import ActivityLog from "../../models/activity-log";

/**
 * Get activity logs for a specific Magic Mover
 * @param req - Express request object
 * @param res - Express response object
 */
export const getMoverActivityLogs = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch logs related to the given Magic Mover ID, sorted in descending order
        const logs = await ActivityLog.find({ mover: id }).sort({ createdAt: -1 });

        return res.status(200).json({ logs });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
