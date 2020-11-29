import 'express-async-errors';

import { json } from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { EnvVariables } from './helpers/constants';

const app = express();

// To ensure that express knows that are using ngnix and that express is behind the ngnix proxy and this proxy is secure
app.set('trust proxy', true)
app.use(json());

// We need to use a cookie because nextjs app will be rendered server side
app.use(cookieSession({
    signed: false,
    secure: true
}))

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler);

// immediately run this startup function
(async () => {
    if (!process.env[EnvVariables.JWT_KEY]) {
        throw new Error('JWT_KEY must be defined within kubenetes')
    }
    
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to mongoDb')
    } catch (err) {
        console.error(err)
    }

    app.listen(3000, () => {
        console.log('listening on 3000!!!!!!!!!!')
    });
    

})()


