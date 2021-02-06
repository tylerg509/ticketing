import 'express-async-errors';

import mongoose from 'mongoose';
import { app } from './app';

import { EnvVariables } from '@tylergasperlin/ticketing-common';


// immediately run this startup function
(async () => {
    if (!process.env[EnvVariables.JWT_KEY]) {
        throw new Error('JWT_KEY must be defined within kubenetes')
    }

    if(!process.env[EnvVariables.MONGO_URI]) {
        throw new Error('MONGO_URI must be defined within kubernetes')
    }
    
    try {
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


