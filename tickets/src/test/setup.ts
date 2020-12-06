import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose'
import { app } from '../app';
import { EnvVariables } from '@tylergasperlin/ticketing-common';
import request from 'supertest'


declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>
        }
    }
}

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

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password'

    const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
        email: email,
        password: password,
    })
    .expect(201);  

    const cookie = authResponse.get('Set-Cookie')

    return cookie
}