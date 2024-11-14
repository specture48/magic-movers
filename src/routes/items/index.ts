import {Router} from "express";

import {wrapHandler} from "@test/utils";

import createItem from "./createItem";
import {CreateItemInput} from "./createItem"
import {validateInputHandler} from "../../middlewares/validator";

const router = Router();

export default (app:any) => {
    app.use('/', router);

    router.post('/items',
        validateInputHandler(CreateItemInput),
        wrapHandler(createItem));

}
