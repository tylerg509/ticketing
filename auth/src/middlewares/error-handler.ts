import { NextFunction, Request, Response } from 'express';
import { RequestValidationError } from '../errors/reqeust-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof RequestValidationError) {

        res.status(err.statusCode).send({ errors: err.serializeErrors() });

    }

    if (err instanceof DatabaseConnectionError) {

        return res.status(err.statusCode).send( { errors: err.serializeErrors() })

    }

    res.status(400).send({ 
        errors: [{ message: 'Something went wrong' }]
    })

}