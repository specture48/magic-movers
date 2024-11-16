import mongoose from "mongoose";
import {MagicMover, MoverStatus, ActivityLog, MagicItem} from "@test/models";

import {clearDatabase, connectToDatabase, disconnectFromDatabase} from "./test-utils/db";
import {MissionService} from "../services/mission.service";
import {MagicItemService} from "../services/magic-item.service";
import {MagicMoverService} from "../services/magic-mover.service";
import {ActivityLogService} from "../services/activity-log.service";
import {ErrorTypes} from "../types";
import BaseError from "../types/types/error";

// Setup Awilix-style container for dependencies
const mockServices = {
    magicItemService: new MagicItemService(),
    magicMoverService: new MagicMoverService(),
    activityLogService: new ActivityLogService(),
};

const missionService = new MissionService(mockServices);

describe("End Mission", () => {
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


    it("should successfully end a mission", async () => {
        // Insert Magic Items within a session
        const items = await MagicItem.insertMany(
            [
                { name: "HeavyItem1", weight: 30 },
                { name: "HeavyItem2", weight: 40 }, // Total = 70, exceeds 50
            ],
            { session }
        );

        // Create a Magic Mover with "on-mission" state
        const mover = await MagicMover.create(
            [
                {
                    name: "Test Mover",
                    questState: MoverStatus.ON_MISSION,
                    weightLimit: 100,
                    currentItems: items.map((item) =>item.id),
                    completedMissions: 0,
                },
            ],
            {session}
        );

        const moverId = mover[0].id;

        // Call the `endMission` service
        await missionService.endMission(moverId, session);


        // Verify the mover's state and items
        const updatedMover = await MagicMover.findById(moverId).session(session).lean();
        expect(updatedMover?.questState).toBe(MoverStatus.RESTING);
        expect(updatedMover?.currentItems).toHaveLength(0);
        expect(updatedMover?.missionsCompleted).toBe(1);

        // Verify activity log
        const log = await ActivityLog.findOne({mover: updatedMover?._id}).session(session);
        expect(log).not.toBeNull();
        expect(log?.action).toBe(MoverStatus.RESTING);
    });

    it("should throw an error if the mover is not on a mission", async () => {
        const mover = await MagicMover.create(
            [
                {
                    name: "Test Mover",
                    questState: MoverStatus.RESTING, // Invalid state for ending a mission
                    weightLimit: 100,
                    currentItems: [],
                },
            ],
            {session}
        );

        const moverId = mover[0].id;

        await expect(missionService.endMission(moverId, session)).rejects.toThrowError(
            new BaseError(ErrorTypes.INVALID_DATA, "Mover is not currently on a mission")
        );
    });




});
