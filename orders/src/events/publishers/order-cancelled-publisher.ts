import { OrderCancelledEvent, Publisher, Subjects } from '@tylergasperlin/ticketing-common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}