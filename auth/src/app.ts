import 'express-async-errors';

import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

const app = express();

// To ensure that express knows that are using ngnix and that express is behind the ngnix proxy and this proxy is secure
app.set('trust proxy', true)
app.use(json());

// We need to use a cookie because nextjs app will be rendered server side
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != 'test' // when in test we should use http and in prod we use https
}))

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app }