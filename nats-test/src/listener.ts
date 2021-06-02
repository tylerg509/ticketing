import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';

import TicketCreatedListener from './events/ticket-created-listener';

console.clear()

/**
 * See readme - need to enable port forwarding or another option for connection to 4222
 */
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});


stan.on('connect', () => {
    console.log('listener connected to NATS')

    // we do this so that nats does not wait for a terminated connection to come back on line
    stan.on('close', () => {
        console.log('Listener connected to NATS')
        
        process.exit();
    })

    new TicketCreatedListener(stan).listen()

})

// we do this so that nats does not wait for a terminated connection to come back on line
// int interrupt or terminate restart or ontrol + C 
// intercept these signals and then close the program
process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())



