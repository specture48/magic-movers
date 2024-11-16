import mongoose from "mongoose";
import {MagicMover, MagicItem, MoverStatus, ActivityLog} from "@test/models";

import {clearDatabase, connectToDatabase, disconnectFromDatabase} from "./test-utils/db";
import {MissionService} from "../services/mission.service";
import {MagicItemService} from "../services/item.service";
import {MagicMoverService} from "../services/magic-mover.service";
import {ActivityLogService} from "../services/activity-log.service";
import BaseError, {ErrorTypes} from "../types/types/error";

// Setup Awilix-style container for dependencies
const mockServices = {
    magicItemService: new MagicItemService(),
    magicMoverService: new MagicMoverService(),
    activityLogService: new ActivityLogService(),
};

const missionService = new MissionService(mockServices);

describe("loadMagicMover", () => {
    let session: mongoose.ClientSession;

    beforeAll(async () => {
        await connectToDatabase();
    });

    beforeEach(async () => {
        session = await mongoose.startSession();
        session.startTransaction();
    });

    afterEach(async () => {
        await session.abortTransaction()
        await session.endSession()

        await clearDatabase();
    });

    afterAll(async () => {
        await disconnectFromDatabase();
    });

    it("should successfully load items onto a Magic Mover", async () => {
        // Create a Magic Mover
        const mover = await MagicMover.create([
                {
                    name: "Test Mover",
                    questState: MoverStatus.RESTING,
                    weightLimit: 100,
                    currentItems: [],
                }
            ],
            {session} // Use the session here
        )

        const moverId = mover[0].id
        // Insert Magic Items
        const items = await MagicItem.insertMany([
                {name: "Item1", weight: 30},
                {name: "Item2", weight: 40},
            ],
            {session} // Use the session here
        );

        // Call the MissionService load method
        await missionService.load(
            moverId,
            items.map(item => item.id),
            session
        );

        // Verify the mover's state and items
        const updatedMover = await MagicMover.findById(moverId).session(session).lean();
        expect(updatedMover?.questState).toBe(MoverStatus.LOADING);
        expect(updatedMover?.currentItems).toHaveLength(2);

        // Verify activity log
        const log = await ActivityLog.findOne({ mover: updatedMover?._id })
            .session(session); // Ensure session is used
        expect(log).not.toBeNull();
        expect(log?.action).toBe(MoverStatus.LOADING);
    });

    it("should throw an error if the total weight of items exceeds the weight limit", async () => {
        // Create a Magic Mover within a session
        const [mover] = await MagicMover.create(
            [
                {
                    name: "Test Mover",
                    questState: MoverStatus.RESTING,
                    weightLimit: 50, // Lower weight limit for testing
                    currentItems: [],
                },
            ],
            { session }
        );

        // Insert Magic Items within a session
        const items = await MagicItem.insertMany(
            [
                { name: "HeavyItem1", weight: 30 },
                { name: "HeavyItem2", weight: 40 }, // Total = 70, exceeds 50
            ],
            { session }
        );

        // Attempt to load items onto the Magic Mover and expect an error
        await expect(
            missionService.load(
                mover.id, // Use `_id` for consistency
                items.map((item) => item.id), // Use `_id` for item IDs
                session
            )
        ).rejects.toThrowError(
                new BaseError(ErrorTypes.INVALID_DATA, "Total weight of items (70) exceeds the allowed limit of 50")
        );
    });

});
