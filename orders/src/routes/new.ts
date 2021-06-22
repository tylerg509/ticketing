import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@tylergasperlin/ticketing-common';
import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // creates somewhat tight coupling with mongoose. If we change database this would need to be removed
    .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response) => {
    // find ticket in db that user is trying to purchase
    const { ticketId } = req.body

    const ticket = await Ticket.findById(ticketId)


    if (!ticket) {
        throw new NotFoundError();
    }
    // make sure ticket is not reserved 
    const isReserved = await ticket.isReserved();
    if(isReserved) {
        throw new BadRequestError('Ticket is already reserved')
    }

    // calc expiration of reserved ticket
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // build order and save to db
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    })

    await order.save()
    // publish event that order was created 

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    })

    res.status(201).send(order)
})

export { router as newOrderRouter }