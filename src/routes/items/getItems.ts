import MagicItem from "../../models/item";

export default async function getItems(req, res) {
    const items = await MagicItem.find();
    return res.status(200).json(items);
}
