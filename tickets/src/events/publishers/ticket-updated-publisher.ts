import { Publisher, Subjects, TicketUpdatedEvent } from '@tylergasperlin/ticketing-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}