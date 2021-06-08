import { requireAuth, validateRequest } from '@tylergasperlin/ticketing-common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
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
            // await new TicketCreatedPublisher(client).publish({
            //     id: ticket.id,
            //     title: ticket.title,
            //     price: ticket.price,
            //     userId: ticket.userId
            // })

            res.status(201).send(ticket);
        } catch(e){
            console.error(e)
            res.status(400).send(e)
        }
    }
);

export { router as createTicketRouter };
