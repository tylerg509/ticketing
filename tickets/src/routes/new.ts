import { requireAuth, validateRequest } from '@tylergasperlin/ticketing-common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express.Router();

router.post(
    '/api/tickets',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price ust be greater than 0'),
    ],
    validateRequest,
    (req: Request, res: Response) => {
        res.sendStatus(200);
    }
);

export { router as createTicketRouter };
