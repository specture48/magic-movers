import { IsNumber, IsString, Min} from "class-validator";
import MagicItem from "../../models/item";

export class CreateItemInput {
    @IsString()
    name!: string;

    @IsNumber()
    @Min(1)
    weight!: number;
}

export const createItem = async (req, res) => {
    try {
        const { name, weight } = req.body;

        const newMagicItem = new MagicItem({ name, weight });
        await newMagicItem.save();

        return res.status(201).json({ ...newMagicItem });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating Magic Item', error: error.message });
    }
};

export default createItem;
