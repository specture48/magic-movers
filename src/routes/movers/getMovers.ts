import {FindConfig, MemoRequest} from "@memo/types";

export default async function getMovers(req: MemoRequest, res) {
    // const manager = container.resolve('manager') as EntityManager
    const loggedInUser = req.loggedInUser

    return res.status(200).json({
        //TODO return data as array of movers
        //TODO maybe pagination
        data,
        // count,
        // offset: skip,
        // limit: take,
    })
}
