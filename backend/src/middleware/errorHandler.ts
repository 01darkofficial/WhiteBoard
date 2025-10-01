import {Request, Response, NextFunction} from 'express';

interface ErrorWithStatus extends Error{
    statusCode?: number;
}

export const errorHandler = (
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction
)=>{

    // Determine if the error has a statusCode (custom errors)
    const statusCode = (err as ErrorWithStatus).statusCode || 500;

    // Type-safe error message
    const message = err instanceof Error ? err.message : String(err);

      // Log server errors
    if(statusCode == 500){
        console.error(`Server error: ${message}`);
    }

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}