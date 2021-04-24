import nats, {Message} from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

/**
 * See readme - need to enable port forwarding or another option for connection to 4222
 */
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});


stan.on('connect', () => {
    console.log('listener connected to NATS')

    const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group')

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data ${data}`)
        }
    })
})
