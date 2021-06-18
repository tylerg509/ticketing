import 'express-async-errors';

import { errorHandler, NotFoundError, currentUser } from '@tylergasperlin/ticketing-common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';
import { showOrderRouter } from './routes/show';


const app = express();

// To ensure that express knows that are using ngnix and that express is behind the ngnix proxy and this proxy is secure
app.set('trust proxy', true)
app.use(json());

// We need to use a cookie because nextjs app will be rendered server side
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != 'test' // when in test we should use http and in prod we use https
}))

app.use(currentUser)

app.use(newOrderRouter);
app.use(indexOrderRouter)
app.use(deleteOrderRouter)
app.use(showOrderRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app }