import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { EnvVariables } from '../helpers/constants'

interface UserPayload {
    id: string;
    email: string;
}

// reach into the express typings and add current user to request
declare global {
    namespace Express {
        // note did not need to extend request
        // Find request interface and add a new one
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {

    if (!req.session?.jwt) {
        return next()
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env[EnvVariables.JWT_KEY]!) as UserPayload
        req.currentUser = payload;
    } catch (err) {

    }

    next()

}