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

    const options = stan.subscriptionOptions()
    .setManualAckMode(true) // set acknoledge mode true (ensures that publisher knows that event has been processed) - after app process event it will respond successfully published event. If it does not process you can do something with it.  you have to write code to tell listeners you processed successfully


    // implement queue groups so that we process in a round robin form. Each event is only processed once
    const subscription = stan.subscribe('ticket:created', 
    'orders-service-queue-group',
    options)

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data ${data}`)
        }

        msg.ack()
    })
})
