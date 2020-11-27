import { NextFunction, Request, Response } from 'express';
import { RequestValidationError } from '../errors/reqeust-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof RequestValidationError) {
        console.log('handling error as request validation error')
    }

    if (err instanceof DatabaseConnectionError) {
        console.log('handling error as database connection error')
    }

    res.status(400).send({ 
        message: err.message
    })

}