import {MemoRequest} from "@memo/types";


export default async function deleteReel(req: MemoRequest, res) {
    const reelId = req.params.id

    return res.status(200).json({})
}
