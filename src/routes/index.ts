import * as express from 'express';
import {Router} from 'express';

import errorHandler from "../middlewares/error-handler";
import movers from "./movers";
import items from "./items";


function attachRoutes(router: Router) {
    movers(router)
    items(router)
}

const router: Router = express.Router();

attachRoutes(router)
router.use(errorHandler);

export {router};
