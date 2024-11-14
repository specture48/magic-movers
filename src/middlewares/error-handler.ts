import type {NextFunction, Request, Response} from 'express';
import BaseError from "../types/types/error";

const API_ERROR = 'api_error';
const INVALID_REQUEST_ERROR = 'invalid_request_error';
const INVALID_STATE_ERROR = 'invalid_state_error';

export default function (err: BaseError, req: Request, res: Response, next: NextFunction) {

    // err = formatException(err);

    console.log(err)
    const errorType = err.type || err.name;

    const errObj = {
        code: err.code,
        type: err.type,
        message: err.message,
    };

    let statusCode = 500;
    switch (errorType) {
        case BaseError.Types.CONFLICT:
            statusCode = 409;
            errObj.code = INVALID_STATE_ERROR;
            errObj.message =
                'The request conflicted with another request. You may retry the request with the provided Idempotency-Key.';
            break;
        case BaseError.Types.UNAUTHORIZED:
            statusCode = 401;
            break;
        case BaseError.Types.DUPLICATE_ERROR:
            statusCode = 422;
            errObj.code = INVALID_REQUEST_ERROR;
            break;
        case BaseError.Types.NOT_ALLOWED:
        case BaseError.Types.INVALID_DATA:
            statusCode = 400;
            break;
        case BaseError.Types.NOT_FOUND:
            statusCode = 404;
            break;
        case BaseError.Types.DB_ERROR:
            statusCode = 500;
            errObj.code = API_ERROR;
            break;
        case BaseError.Types.UNEXPECTED_STATE:
        case BaseError.Types.INVALID_ARGUMENT:
            break;
        default:
            errObj.code = 'unknown_error';
            errObj.message = 'An unknown error occurred.';
            errObj.type = 'unknown_error';
            break;
    }

    res.status(statusCode).json(errObj);
}
