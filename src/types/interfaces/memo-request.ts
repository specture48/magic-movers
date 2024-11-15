import {Request} from 'express'
import {AwilixContainer} from "awilix";


export interface MemoRequest extends Request{
    // loggedInUser:User
    container:AwilixContainer
}