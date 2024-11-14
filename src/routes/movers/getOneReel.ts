import { MemoRequest} from "@memo/types";
import {  getRepository} from "typeorm";

import { Reel } from "../../database/entities/reel/reel.entity";
import { ReelView } from "../../database/entities/reel/reel-view.entity";

export default async function getOneReel(req: MemoRequest, res) {
    // const manager = container.resolve('manager') as EntityManager
    const loggedInUser = req.loggedInUser
    const id=req.params.id

    return res.status(200).json({
        reel,
    })
}
