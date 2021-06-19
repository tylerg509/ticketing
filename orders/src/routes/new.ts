import { requireAuth, validateRequest } from '@tylergasperlin/ticketing-common';
import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose'

const router = express.Router();

router.post('api/orders', requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // creates somewhat tight coupling with mongoose. If we change database this would need to be removed
    .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response) => {
    res.send({})
})

export { router as newOrderRouter }