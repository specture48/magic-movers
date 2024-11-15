import {Router} from "express";

import {wrapHandler} from "@test/utils";

import {validateInputHandler} from "../../middlewares/validator";

import createMover from "./createMover";
import {CreateMoverInput} from "./createMover"
import {loadMagicMover, LoadMagicMoverInput} from "./load";
import getMovers from "./getMovers";
import {startMission} from "./startMission";
import {endMission} from "./endMission";
import {getMoverActivityLogs} from "./getMoverActivityLogs";

const router = Router();

export default (app:any) => {
    app.use('/', router);

    router.get('/movers',wrapHandler(getMovers))
    router.get('/movers/:id/logs',wrapHandler(getMoverActivityLogs))

    router.post('/movers',
        validateInputHandler(CreateMoverInput),
        wrapHandler(createMover));

    router.post('/movers/:id/load',validateInputHandler(LoadMagicMoverInput), wrapHandler(loadMagicMover));
    router.post('/movers/:id/start-mission', wrapHandler(startMission));
    router.post('/movers/:id/end-mission', wrapHandler(endMission));
}
