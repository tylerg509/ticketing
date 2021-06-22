import { Publisher, OrderCreatedEvent, Subjects } from '@tylergasperlin/ticketing-common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}