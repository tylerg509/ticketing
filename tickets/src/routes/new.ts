import { requireAuth } from '@tylergasperlin/ticketing-common'
import express, { Request, response, Response} from 'express'

const router = express.Router()

router.post('/api/tickets', requireAuth, (req: Request, res: Response) => {
    response.sendStatus(200)
});


export { router as createTicketRouter }