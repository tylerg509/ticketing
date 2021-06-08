import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear()

/**
 * See readme - need to enable port forwarding or another option for connection to 4222
 */
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS')

    const publisher = new TicketCreatedPublisher(stan);
    try{
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20,
            userId: ''
        })
    } catch(err) {
        console.log(err)
    }


})
