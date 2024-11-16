import mongoose from "mongoose";
import {MagicMover, MoverStatus, ActivityLog, MagicItem} from "@test/models";

import {clearDatabase, connectToDatabase, disconnectFromDatabase} from "./test-utils/db";
import {MissionService} from "../services/mission.service";
import {MagicItemService} from "../services/magic-item.service";
import {MagicMoverService} from "../services/magic-mover.service";
import {ActivityLogService} from "../services/activity-log.service";
import  {ErrorTypes} from "../types";
import BaseError from "../types/types/error";

// Setup Awilix-style container for dependencies
const mockServices = {
    magicItemService: new MagicItemService(),
    magicMoverService: new MagicMoverService(),
    activityLogService: new ActivityLogService(),
};

const missionService = new MissionService(mockServices);

describe("startMission", () => {
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

    it("should successfully start a mission for a Magic Mover in the loading state", async () => {
        // Insert Magic Items within a session
        const items = await MagicItem.insertMany(
            [
                { name: "HeavyItem1", weight: 30 },
                { name: "HeavyItem2", weight: 40 }, // Total = 70, exceeds 50
            ],
            { session }
        );

        // Create a Magic Mover in the loading state
        const [mover] = await MagicMover.create(
            [
                {
                    name: "Test Mover",
                    questState: MoverStatus.LOADING, // Required state for starting a mission
                    weightLimit: 100,
                    currentItems: items.map((item) => item.id), // Use `_id` for item IDs
                },
            ],
            { session }
        );

        // Call the `startMission` method on the missionService
        await expect(
            missionService.startMission(mover.id, session)
        ).resolves.not.toThrow();

        // Fetch the updated mover
        const updatedMover = await MagicMover.findById(mover._id).session(session).lean();
        // Assertions
        expect(updatedMover?.questState).toBe(MoverStatus.ON_MISSION);

        // Verify activity log
        const log = await ActivityLog.findOne({ mover: updatedMover?._id }).session(session);
        expect(log).not.toBeNull();
        expect(log?.action).toBe(MoverStatus.ON_MISSION);
    });

    it("should throw an error if the Magic Mover is not in the loading state", async () => {
        // Create a Magic Mover not in the loading state
        const [mover] = await MagicMover.create(
            [
                {
                    name: "Test Mover",
                    questState: MoverStatus.RESTING, // Invalid state for starting a mission
                    weightLimit: 100,
                    currentItems: [],
                },
            ],
            { session }
        );

        // Attempt to start a mission and expect an error
        await expect(
            missionService.startMission(mover.id, session)
        ).rejects.toThrowError(
            new BaseError(ErrorTypes.INVALID_DATA, "Mover must be in loading state to start a mission")
        );
    });

});
