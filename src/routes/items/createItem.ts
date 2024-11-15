import container from "../../container";
import {MagicItemService} from "../../services/item.service";
import {CreateItemInput} from "./inputs/create-item.input";

/**
 * @swagger
 * /items:
 *   post:
 *     summary: "Create a new Magic Item"
 *     description: "Create a new Magic Item with a name and weight."
 *     operationId: "createItem"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               name:
 *                 type: "string"
 *                 description: "The name of the magic item."
 *                 example: "Magic Sword"
 *               weight:
 *                 type: "number"
 *                 description: "The weight of the magic item (minimum 1)."
 *                 example: 10
 *             required:
 *               - name
 *               - weight
 *     responses:
 *       201:
 *         description: "Magic Item created successfully."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MagicItem"
 *             example:
 *               id: "64b5f5e2e1a5c9f9f1e9b8a9"
 *               name: "Magic Sword"
 *               weight: 10
 *               createdAt: "2024-11-14T10:00:00Z"
 *               updatedAt: "2024-11-14T10:00:00Z"
 *       400:
 *         description: "Validation error"
 *       500:
 *         description: "Internal server error"
 *     tags:
 *       - Magic Items
 */
export const createItem = async (req, res) => {
    try {
        const input = req.body as CreateItemInput
        const magicItemService = container.resolve<MagicItemService>("magicItemService")

        const newMagicItem=await magicItemService.createItem(input)
        return res.status(201).json({ ...newMagicItem });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating Magic Item', error: error.message });
    }
};

export default createItem;
