import { NotFoundError, requireAuth, validateRequest } from '@tylergasperlin/ticketing-common';
import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('api/orders', requireAuth, [
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

    // calc expiration of reserved ticket

    // build order and save to db

    // publish event that order was created 


    res.send({})
})

export { router as newOrderRouter }