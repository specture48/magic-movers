import container from "../../container";
import {MagicItemService} from "../../services/magic-item.service";

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve a list of Magic Items with pagination
 *     description: Fetch paginated Magic Items available in the database.
 *     tags:
 *       - Magic Items
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The number of items to skip.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The maximum number of items to retrieve.
 *     responses:
 *       200:
 *         description: A list of Magic Items with pagination metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MagicItem'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *       500:
 *         description: Internal server error.
 */

export default async function getItems(req, res) {
    const magicItemService = container.resolve<MagicItemService>("magicItemService");

    const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10
    const offset = parseInt(req.query.offset, 10) || 0; // Default offset is 0

    const {items, total} = await magicItemService.getPaginatedItems(offset, limit);

    return res.status(200).json({
        data: items,
        meta: {
            totalItems: total,
            itemsPerPage: limit,
            offset: offset,
        },
    });
}
