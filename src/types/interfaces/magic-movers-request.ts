import {Request} from 'express'
import {AwilixContainer} from "awilix";


export interface MagicMoversRequest extends Request{
    container:AwilixContainer
}