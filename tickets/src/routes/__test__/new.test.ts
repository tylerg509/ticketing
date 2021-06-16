import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper')

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
});

it('can only be acessed if the user is signed in', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status othr than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    const result = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10,
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10,
        })
        .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    const result = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'gooa3efa',
            price: -10,
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'gooa3efa',
        })
        .expect(400);
});

it('creates a ticket with valid inputs', async () => {
    const tickets1 = await Ticket.find({});
    expect(tickets1.length).toEqual(0);

    const title = 'goosehat';

    const result = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: 20,
        })
        .expect(201);

    const tickets2 = await Ticket.find({});
    expect(tickets2.length).toEqual(1);
    expect(tickets2[0].price).toEqual(20);
    expect(tickets2[0].title).toEqual(title);
});

it('publishes an event', async () => {
    const title = 'goosehat';

    const result = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: 20,
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})