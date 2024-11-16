import {ObjectId} from "mongodb";
import { IMagicMover, MoverStatus} from "@test/models";
import {ActivityLogService} from "./activity-log.service";
import {MagicItemService} from "./item.service";
import BaseError, {ErrorTypes} from "../types/types/error";
import {MagicMoverService} from "./magic-mover.service";

export class CreateMissionInput {
    items: string[];
    mover: IMagicMover
}

export class MissionService {

    private readonly magicItemService: MagicItemService;
    private readonly activityLogService: ActivityLogService;
    private readonly magicMoverService: MagicMoverService;


    constructor({
                    magicItemService,
                    activityLogService,
                    magicMoverService
                }: {
        magicItemService: MagicItemService;
        magicMoverService: MagicMoverService;
        activityLogService: ActivityLogService;
    }) {
        this.magicItemService = magicItemService;
        this.activityLogService = activityLogService;
        this.magicMoverService = magicMoverService
    }

    /**
     * Ends the mission for a given Magic Mover.
     * @param moverId - The ID of the Magic Mover.
     * @param session - The database session for the transaction.
     * @throws {BaseError} Throws if the Magic Mover is not found or is not on a mission.
     */
    async endMission(moverId:string, session:any){
        const mover = await this.magicMoverService.findById(moverId, session);
        if (!mover) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Magic Mover not found');
        }

        // Ensure the Mover is currently on a mission
        if (mover.questState !== MoverStatus.ON_MISSION) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Mover is not currently on a mission');
        }

        mover.currentItems = [];
        mover.questState = MoverStatus.RESTING;
        mover.missionsCompleted += 1;

        await Promise.all([
            this.magicMoverService.updateMover(mover.id, mover, session),
            this.activityLogService.createLog(mover, MoverStatus.RESTING, mover.currentItems.map(item => item._id.toString()), session)
        ])

    }

    /**
     * Starts a mission for a given Magic Mover.
     * @param moverId - The ID of the Magic Mover.
     * @param session - The database session for the transaction.
     * @throws {BaseError} Throws if the Magic Mover is not found, already on a mission, or not in the loading state.
     */
    async startMission(moverId: string,session:any){
        const mover = await this.magicMoverService.findById(moverId, session);
        if (!mover) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Magic Mover not found');
        }

        if (mover.questState === MoverStatus.ON_MISSION) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Mover is already on a mission');
        }

        if (mover.questState !== MoverStatus.LOADING) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Mover must be in loading state to start a mission');
        }

        mover.questState = MoverStatus.ON_MISSION;
        await Promise.all([
            this.magicMoverService.updateMover(mover.id,mover, session),
            this.activityLogService.createLog(mover, MoverStatus.ON_MISSION, mover.currentItems.map(item => item._id.toString()), session),
        ])

    }

    /**
     * Loads items onto a Magic Mover and sets its state to 'LOADING'.
     * @param moverId - The ID of the Magic Mover.
     * @param itemIds - List of item IDs to load.
     * @param session - The database session for the transaction.
     * @throws {BaseError} Throws if the Magic Mover is not found, not in the 'RESTING' state, or if the weight limit is exceeded.
     */
    async load(moverId: string, itemIds: string[], session: any) {
        const mover = await this.magicMoverService.findById(moverId, session);
        if (!mover) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Magic Mover not found');
        }

        await this.validateWeightLimit(itemIds, mover.weightLimit,session);

        if (mover.questState !== MoverStatus.RESTING) {
            throw new BaseError(ErrorTypes.INVALID_DATA, 'Cannot load items onto a Magic Mover that is not resting');
        }

        mover.questState = MoverStatus.LOADING;
        mover.currentItems=itemIds.map(item => new ObjectId(item));

        await Promise.all([
            this.magicMoverService.updateMover(mover.id, mover, session),
            this.activityLogService.createLog(mover, MoverStatus.LOADING, mover.currentItems.map(item => item._id.toString()), session),
        ])
    }

    /**
     * Validates the total weight of items against a Magic Mover's weight limit.
     * @param itemIds - List of item IDs to validate.
     * @param weightLimit - The weight limit of the Magic Mover.
     * @throws {BaseError} Throws if the total weight of items exceeds the weight limit.
     */
    async validateWeightLimit(itemIds: string[], weightLimit: number,session:any) {
        const items = await this.magicItemService.findByIds(itemIds,session);

        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        if (totalWeight > weightLimit) {
            throw new BaseError(ErrorTypes.INVALID_DATA,`Total weight of items (${totalWeight}) exceeds the allowed limit of ${weightLimit}`);
        }
    };

    // async create(input: CreateMissionInput): Promise<IMission> {
    //     const doc = new Mission({...input,});
    //     await doc.save();
    //     return doc;
    // }

}
