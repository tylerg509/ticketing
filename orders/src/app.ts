import 'express-async-errors';

import { errorHandler, NotFoundError, currentUser } from '@tylergasperlin/ticketing-common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import { showTicketRouter } from './routes/show'

import { createTicketRouter } from './routes/new';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

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

app.use(createTicketRouter);
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app }