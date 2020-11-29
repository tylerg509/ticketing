import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose'
import { app } from '../app';
import { EnvVariables } from '../helpers/constants';

let mongo: any;

beforeAll(async () => {
    process.env[EnvVariables.JWT_KEY] = 'asdfasdf'
    
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach( async () => {
    const collections = await mongoose.connection.db.collections();

    collections.forEach(async (element) => {
        await element.deleteMany({})
    });
})

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})