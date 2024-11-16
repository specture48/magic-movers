import {createContainer, asClass} from "awilix";

import {MagicMoverService} from "./services/magic-mover.service";
import {MagicItemService} from "./services/magic-item.service";
import {ActivityLogService} from "./services/activity-log.service";
import {MissionService} from "./services/mission.service";

const container = createContainer();

container.register({
    magicMoverService: asClass(MagicMoverService).singleton(),
    magicItemService: asClass(MagicItemService).singleton(),
    activityLogService: asClass(ActivityLogService).singleton(),
    missionService: asClass(MissionService).singleton(),
});

export default container;
