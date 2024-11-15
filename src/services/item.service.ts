import {IMagicItem, MagicItem} from "@test/models";
import { CreateItemInput } from "../routes/items/inputs/create-item.input";

/**
 * Service for managing Magic Items.
 */
export class MagicItemService {
    /**
     * Creates a new magic item.
     * @param {CreateItemInput} input - The input data for creating the magic item.
     * @returns {Promise<MagicItem>} - The created magic item.
     */
    async createItem(input: CreateItemInput): Promise<IMagicItem> {
        const newMagicItem = new MagicItem({ ...input });
        await newMagicItem.save();
        return newMagicItem;
    }

    /**
     * Retrieves all magic items.
     * @returns {Promise<MagicItem[]>} - An array of all magic items.
     */
    async getItems(): Promise<IMagicItem[]> {
        const items = await MagicItem.find();
        return items;
    }

    /**
     * Retrieves magic items by their IDs.
     * @param {string[]} ids - An array of magic item IDs to fetch.
     * @returns {Promise<MagicItem[]>} - An array of magic items matching the provided IDs.
     */
    async findByIds(ids: string[]): Promise<IMagicItem[]> {
        const items = await MagicItem.find({ _id: { $in: ids } });
        return items;
    }
}
