import {createContainer, asClass} from "awilix";

import {MagicMoverService} from "./services/magic-mover.service";
import {MagicItemService} from "./services/item.service";
import {ActivityLogService} from "./services/activity-log.service";

const container = createContainer();

container.register({
    magicMoverService: asClass(MagicMoverService).singleton(),
    magicItemService: asClass(MagicItemService).singleton(),
    activityLogService: asClass(ActivityLogService).scoped(),
});

export default container;
