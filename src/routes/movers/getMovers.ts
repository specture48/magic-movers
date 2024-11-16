import container from "../../container";
//TODO fix swagger pagination

/**
 * @swagger
 * /movers:
 *   get:
 *     summary: "Get list of movers ordered by completed missions"
 *     description: "Fetch Magic Movers ordered by the number of missions completed, in descending order. Optional pagination can be applied."
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
 *       - name: "page"
 *         in: "query"
 *         description: "Page number to fetch."
 *         required: false
 *         schema:
 *           type: "integer"
 *           default: 1
 *           minimum: 1
 *     responses:
 *       200:
 *         description: "A list of Magic Movers ordered by the number of completed missions."
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: "#/components/schemas/Mover"
 *             example:
 *               - id: "64b5f5e2e1a5c9f9f1e9b8a7"
 *                 name: "Mover1"
 *                 weightLimit: 500
 *                 questState: "resting"
 *                 missionsCompleted: 10
 *                 createdAt: "2024-11-14T10:00:00Z"
 *                 updatedAt: "2024-11-14T10:05:00Z"
 *               - id: "64b5f5e2e1a5c9f9f1e9b8a8"
 *                 name: "Mover2"
 *                 weightLimit: 600
 *                 questState: "loading"
 *                 missionsCompleted: 8
 *                 createdAt: "2024-11-13T09:00:00Z"
 *                 updatedAt: "2024-11-13T09:05:00Z"
 *       500:
 *         description: "Internal server error"
 *     tags:
 *       - Magic Movers
 */
export  const getMovers=async (req, res)=> {
    const moverService = container.resolve("magicMoverService"); // Resolve the service

    const movers = await moverService.getMoversByMissionCount();

    return res.status(200).json({data:movers});
        //TODO return data as array of movers
        //TODO maybe pagination
}
