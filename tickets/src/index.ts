import 'express-async-errors';

import mongoose from 'mongoose';
import { app } from './app';

import { EnvVariables } from '@tylergasperlin/ticketing-common';


// immediately run this startup function
(async () => {
    if (!process.env[EnvVariables.JWT_KEY]) {
        throw new Error('JWT_KEY must be defined within kubenetes')
    }
    
    try {
        await mongoose.connect(EnvVariables.JWT_KEY, {
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


