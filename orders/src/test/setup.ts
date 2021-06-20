import { EnvVariables } from '@tylergasperlin/ticketing-common';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
    namespace NodeJS {
        interface Global {
            signin(): string[];

        }
    }
}

jest.mock('../nats-wrapper')

let mongo: any;

beforeAll(async () => {
    jest.clearAllMocks()
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

global.signin = () => {
    // Build JWT Payload { id, email }
    const payload = { 
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'goose@goose.com'
    }

    // Create JWT
    const token = jwt.sign(payload, process.env[EnvVariables.JWT_KEY]!)

    // Build Session Object { jwt: MY_JWT }
    const session = { jwt: token }

    // Turn that session into json
    const sessionJSON = JSON.stringify(session)

    // Take JSON and encode it to base64
    const base64 = Buffer.from(sessionJSON).toString('base64')

    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`]

}