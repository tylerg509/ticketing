import 'express-async-errors';

import mongoose from 'mongoose';
import { app } from './app';

import { EnvVariables } from '@tylergasperlin/ticketing-common';
import { natsWrapper } from './nats-wrapper';


// immediately run this startup function
(async () => {
    if (!process.env[EnvVariables.JWT_KEY]) {
        throw new Error('JWT_KEY must be defined within kubenetes')
    }

    if(!process.env[EnvVariables.MONGO_URI]) {
        throw new Error('MONGO_URI must be defined within kubernetes')
    }
    
    try {
        await natsWrapper.connect('ticketing', 'laskik', 'http://nats-srv:4222');

        // we do this so that nats does not wait for a terminated connection to come back on line
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed')
            
            process.exit();
        })
        // we do this so that nats does not wait for a terminated connection to come back on line
        // int interrupt or terminate restart or ontrol + C 
        // intercept these signals and then close the program
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(process.env[EnvVariables.MONGO_URI]!, {
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


