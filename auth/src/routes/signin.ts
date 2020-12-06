import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { EnvVariables } from '../helpers/constants';
import { validateRequest, BadRequestError } from '@tylergasperlin/ticketing-common';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', 
[ 
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
], validateRequest,
async (req: Request, res: Response) => {
    
    const {email, password} = req.body;

    const existingUser = await User.findOne({email})
    
    // note that we don't tell the user if password or username is incorrect on purpose - too much info in case of bad actor
    if (!existingUser) {
        throw new BadRequestError('Invalid credentials')
    }

    const passwordsMatch = await Password.compare(existingUser.password, password)

    if (!passwordsMatch) {
        throw new BadRequestError('Invalid credentials')
    }

    // generate jwt
    // process.env.jwt_key was set using kubectl create secret generic jwt-secret --from-literal=JWT_KEY={INSERT SECRET HERE AND DO NOT USE CURLY BRACE}
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env[EnvVariables.JWT_KEY]!)  // override ok since this check is handled on startup 

    // store on session obj
    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser)
});

export { router as signInRouter }