import container from "../../container";
import {MagicMoverService} from "../../services/magic-mover.service";

/**
 * @swagger
 * /movers:
 *   get:
 *     summary: "Get list of movers ordered by completed missions"
 *     description: "Fetch Magic Movers ordered by the number of missions completed, in descending order. Optional pagination can be applied using limit and offset."
 *     operationId: "getMovers"
 *     parameters:
 *       - name: "limit"
 *         in: "query"
 *         description: "Number of movers to return per page."
 *         required: false
 *         schema:
 *           type: "integer"
 *           default: 10
 *           minimum: 1
 *       - name: "offset"
 *         in: "query"
 *         description: "The offset (starting point) to fetch movers from."
 *         required: false
 *         schema:
 *           type: "integer"
 *           default: 0
 *           minimum: 0
 *     responses:
 *       200:
 *         description: "A paginated list of Magic Movers ordered by the number of completed missions."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 data:
 *                   type: "array"
 *                   items:
 *                     $ref: "#/components/schemas/Mover"
 *                 meta:
 *                   type: "object"
 *                   properties:
 *                     totalItems:
 *                       type: "integer"
 *                       description: "Total number of movers."
 *                       example: 100
 *                     itemsPerPage:
 *                       type: "integer"
 *                       description: "Number of movers returned per page."
 *                       example: 10
 *             example:
 *               data:
 *                 - id: "64b5f5e2e1a5c9f9f1e9b8a7"
 *                   name: "Mover1"
 *                   weightLimit: 500
 *                   questState: "resting"
 *                   missionsCompleted: 10
 *                   createdAt: "2024-11-14T10:00:00Z"
 *                   updatedAt: "2024-11-14T10:05:00Z"
 *                 - id: "64b5f5e2e1a5c9f9f1e9b8a8"
 *                   name: "Mover2"
 *                   weightLimit: 600
 *                   questState: "loading"
 *                   missionsCompleted: 8
 *                   createdAt: "2024-11-13T09:00:00Z"
 *                   updatedAt: "2024-11-13T09:05:00Z"
 *               meta:
 *                 totalItems: 100
 *                 itemsPerPage: 10
 *       500:
 *         description: "Internal server error"
 *     tags:
 *       - Magic Movers
 */

export const getMovers = async (req, res) => {
    const moverService = container.resolve<MagicMoverService>("magicMoverService"); // Resolve the service

    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    // Fetch paginated movers
    const {movers, total} = await moverService.getPaginatedMovers(offset, limit);

    // Send paginated response
    return res.status(200).json({
        data: movers,
        meta: {
            totalItems: total,
            itemsPerPage: limit,
        },
    });
};

