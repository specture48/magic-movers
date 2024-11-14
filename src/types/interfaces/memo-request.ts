import {Request} from 'express'
import {AwilixContainer} from "awilix";

import {FindConfig} from "../types";

export interface MemoRequest extends Request{
    // loggedInUser:User
    container:AwilixContainer
}