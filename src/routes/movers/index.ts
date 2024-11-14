import {Router} from "express";

import {wrapHandler} from "@test/utils";

import createMover from "./createMover";
import {CreateMoverInput} from "./createMover"
import {loadMagicMover} from "./load";
import {validateInputHandler} from "../../middlewares/validator";

const router = Router();

export default (app:any) => {
    app.use('/', router);

    // router.get('/me/reels',wrapHandler(getMyReels))
    // router.delete('/movers/:id'  , wrapHandler(deleteReel))
    router.post('/movers',
        validateInputHandler(CreateMoverInput),
        wrapHandler(createMover));


    router.post('/movers/:id/load', wrapHandler(loadMagicMover));


}
