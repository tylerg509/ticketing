import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { EnvVariables } from '../helpers/constants';
import { validateRequest } from '../middlewares/validate-result';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength( { min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters')
], validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        throw new BadRequestError('Email in use')
    }

    const user = User.build({email, password})
    await user.save();

    // generate jwt
    // process.env.jwt_key was set using kubectl create secret generic jwt-secret --from-literal=JWT_KEY={INSERT SECRET HERE AND DO NOT USE CURLY BRACE}
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env[EnvVariables.JWT_KEY]!)  // override ok since this check is handled on startup 

    // store on session obj
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user)

});

export { router as signUpRouter }