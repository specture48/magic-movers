import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";

export const validateInputHandler = (schema: any) => async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
    try {
        // Debugging logs
        // console.log("Incoming request body:", req.body);

        // Convert plain JSON to class instance
        const input = plainToInstance(schema, req.body);

        // console.log("Transformed input:", input);

        // Validate the input instance
        const errors = await validate(input, { whitelist: true });

        if (errors.length > 0) {
            const formattedErrors = errors.map(err => ({
                property: err.property,
                constraints: err.constraints,
            }));

            // Send validation error response
            return res.status(400).json({
                message: "Validation failed",
                errors: formattedErrors,
            });
        }

        // If no errors, proceed to the next middleware or handler
        next();
    } catch (error) {
        console.error("Validation error:", error);
        next(error);
    }
};
