import MagicMover from "../../models/mover";

export default async function getMovers(req, res) {
    // Fetch Magic Movers ordered by missionCount in descending order
    const movers = await MagicMover.find().sort({missionsCompleted:-1});
    return res.status(200).json(movers);

    // return res.status(200).json({
        //TODO return data as array of movers
        //TODO maybe pagination

        // data,
        // count,
        // offset: skip,
        // limit: take,
    // })
}
