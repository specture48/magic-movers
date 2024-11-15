import {Router} from "express";

import {wrapHandler} from "@test/utils";

import createItem from "./createItem";
import getItems from "./getItems";
import {validateInputHandler} from "../../middlewares/validator";
import {CreateItemInput} from "./inputs/create-item.input";

const router = Router();

export default (app:any) => {
    app.use('/', router);

    router.get('/items',wrapHandler(getItems))

    router.post('/items',
        validateInputHandler(CreateItemInput),
        wrapHandler(createItem));
}
