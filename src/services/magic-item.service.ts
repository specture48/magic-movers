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
    async createItem(input: CreateItemInput,session?:any): Promise<IMagicItem> {
        let newMagicItem = new MagicItem({ ...input });
        newMagicItem=await newMagicItem.save({session});
        return newMagicItem.toJSON();
    }

    /**
     * Fetches a paginated list of Magic Items from the database.
     *
     * @param {number} offset - The number of items to skip before starting to collect the result set.
     * @param {number} limit - The maximum number of items to retrieve.
     * @returns {Promise<{items: Array<Object>, total: number}>}
     *   A promise that resolves to an object containing:
     *     - `items`: An array of Magic Items.
     *     - `total`: The total number of Magic Items available in the database.
     *
     * @throws {Error} If there is an issue querying the database.
     *
     * @example
     * // Retrieve the first 10 Magic Items
     * const { items, total } = await getPaginatedItems(0, 10);
     *
     * // Retrieve the next 10 Magic Items
     * const { items, total } = await getPaginatedItems(10, 10);
     */
    async getPaginatedItems(offset: number, limit: number): Promise<{ items: Array<object>; total: number; }> {
        const items = await MagicItem.find().limit(limit).skip(offset);
        const total = await MagicItem.countDocuments();
        return { items, total };
    }


    /**
     * Retrieves magic items by their IDs.
     * @param {string[]} ids - An array of magic item IDs to fetch.
     * @returns {Promise<IMagicItem[]>} - An array of magic items matching the provided IDs.
     */
    async findByIds(ids: string[],session:any): Promise<IMagicItem[]> {
        const items = await MagicItem.find({ _id: { $in: ids } }).session(session);
        return items;
    }
}
