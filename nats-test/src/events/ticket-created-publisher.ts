import { Publisher } from '@tylergasperlin/ticketing-common';
import { Subjects } from '@tylergasperlin/ticketing-common';
import { TicketCreatedEvent } from '@tylergasperlin/ticketing-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}