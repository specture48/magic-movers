import ActivityLog from "../../models/activity-log";


/**
 * @swagger
 * /movers/{id}/logs:
 *   get:
 *     summary: Get activity logs for a specific Magic Mover
 *     description: Fetches the activity logs for a Magic Mover by its ID, sorted in descending order by timestamp.
 *     tags:
 *       - Magic Movers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Magic Mover
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityLog'
 *       404:
 *         description: Mover not found or no logs available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No activity logs found for this Mover
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


export const getMoverActivityLogs = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch logs related to the given Magic Mover ID, sorted in descending order
        const logs = await ActivityLog.find({ mover: id }).sort({ createdAt: -1 });

        return res.status(200).json({ data:logs });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
