import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@tylergasperlin/ticketing-common';
import express, { Response, Request } from 'express';
import { Order } from '../models/order';


const router = express.Router();

router.delete('api/orders/:orderId', requireAuth,  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket') // should verify orderid first

    if(!order) {
        throw new NotFoundError()
    }

    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled;
    await order.save();
    
    res.send(order)
})

export { router as deleteOrderRouter }