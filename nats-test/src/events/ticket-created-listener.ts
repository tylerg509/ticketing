import { Message } from 'node-nats-streaming';
import { Listener } from '@tylergasperlin/ticketing-common'
import { Subjects } from '@tylergasperlin/ticketing-common';
import { TicketCreatedEvent } from '@tylergasperlin/ticketing-common';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('event data!', data)

        msg.ack()
    }
}

export default TicketCreatedListener;