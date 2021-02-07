import { requireAuth, validateRequest } from '@tylergasperlin/ticketing-common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
    '/api/tickets',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price ust be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id, //bang is ok since requireAuth checks for a current user
        });

        try {

            await ticket.save();

        } catch(e){

            console.error(e)

        }


        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
