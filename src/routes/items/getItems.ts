import MagicItem from "../../models/item";

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
    const items = await MagicItem.find();
    return res.status(200).json(items);
}
