import { NextFunction, Request, RequestHandler, Response } from "express";

type Handler = (req: Request, res: Response) => Promise<void>;

export const wrapHandler = (fn: Handler): RequestHandler => {
    return async (
        req: Request & { errors?: Error[] },
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (req?.errors?.length) {
                // Create a new error to pass it to the next() function for Express error handling
                const error = new Error(
                    "Provided request body contains errors. Please check the data and retry the request"
                );
                error.name = "ValidationError";
                return next(error);
            }
            // Execute the handler function and pass errors to next() if any occur
            await fn(req, res);
        } catch (error) {
            next(error);
        }
    };
};

export * from './validator';
