import { Publisher, Subjects, TicketCreatedEvent } from '@tylergasperlin/ticketing-common';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}