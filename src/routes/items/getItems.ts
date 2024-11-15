import container from "../../container";
import {MagicItemService} from "../../services/item.service";

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve a list of Magic Items
 *     description: Fetch all Magic Items available in the database.
 *     tags:
 *       - Magic Items
 *     responses:
 *       200:
 *         description: A list of Magic Items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MagicItem'
 *       500:
 *         description: Internal server error.
 */

export default async function getItems(req, res) {
    const magicItemService = container.resolve<MagicItemService>("magicItemService")

    const items = await magicItemService.getItems()
    return res.status(200).json({data:items});
}
