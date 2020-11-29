import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    // This middleware assumes we have already used the middleware to validate jwt token (currentUser)
    if (!req.currentUser) {
        throw new NotAuthorizedError()
    }

    next()
}