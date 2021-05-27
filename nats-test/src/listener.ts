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

    // we do this so that nats does not wait for a terminated connection to come back on line
    stan.on('close', () => {
        console.log('Listener connected to NATS')
        
        process.exit();
    })

    const options = stan
    .subscriptionOptions()
    .setManualAckMode(true) // set acknoledge mode true (ensures that publisher knows that event has been processed) - after app process event it will respond successfully published event. If it does not process you can do something with it.  you have to write code to tell listeners you processed successfully
    .setDeliverAllAvailable() // the very first time a listener is created -> send all prior events to the listener. This is ignored on restart and only used when we bring the listener online for the first time
    .setDurableName('accounting-service') // the events we delivered in the past will be marked as delivered


    // implement queue groups so that we process in a round robin form. Each event is only processed once
    const subscription = stan.subscribe(
    'ticket:created', 
    'queue-group-name', // even if we disconnect all services the durable name will be maintained
    options)

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data ${data}`)
        }

        msg.ack()
    })
})

// we do this so that nats does not wait for a terminated connection to come back on line
// int interrupt or terminate restart or ontrol + C 
// intercept these signals and then close the program
process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())


