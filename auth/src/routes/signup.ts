import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/reqeust-validation-error';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength( { min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters')
], async (req: Request, res: Response) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }

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
    }, process.env.JWT_KEY!)  // override ok since this check is handled on startup 

    // store on session obj
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user)

});

export { router as signUpRouter }