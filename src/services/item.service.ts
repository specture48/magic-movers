import {MagicItem} from "@test/models";
import {CreateItemInput} from "../routes/items/inputs/create-item.input";

export  class MagicItemService {

    async createItem(input:CreateItemInput) {
        const newMagicItem = new MagicItem({ ...input });
        await newMagicItem.save();
        return newMagicItem;
    }

    /**
     * Retrieve all magic items.
     * @returns An array of magic items.
     */
    async getItems() {
        const items = await MagicItem.find();
        return items;
    }

    /**
     * Retrieve magic items by their IDs.
     * @param ids - An array of magic item IDs.
     * @returns An array of magic items matching the provided IDs.
     */
    async findByIds(ids: string[]) {
        const items = await MagicItem.find({ _id: { $in: ids } });
        return items;
    }
}
