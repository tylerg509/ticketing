import nats, {Message, Stan} from 'node-nats-streaming'
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

    new TicketCreatedListener(stan).listen()

})

// we do this so that nats does not wait for a terminated connection to come back on line
// int interrupt or terminate restart or ontrol + C 
// intercept these signals and then close the program
process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())


abstract class Listener {
    private client: Stan;
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;
    protected ackWait = 5 * 1000;


    constructor (client: Stan) {
        this.client = client;


    }

    subscriptionOptions(){
        return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()// the very first time a listener is created -> send all prior events to the listener. This is ignored on restart and only used when we bring the listener online for the first time
        .setManualAckMode(true)// set acknoledge mode true (ensures that publisher knows that event has been processed) - after app process event it will respond successfully published event. If it does not process you can do something with it.  you have to write code to tell listeners you processed successfully
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName)// the events we delivered in the past will be marked as delivered

    }

    listen() {
        // implement queue groups so that we process in a round robin form. Each event is only processed once
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,// even if we disconnect all services the durable name will be maintained
            this.subscriptionOptions()
        )
        subscription.on('message', (msg: Message) => {
            console.log(
                `Message received ${this.subject} / ${this.queueGroupName}`
            )

            const parsedData = this.parseMessage(msg)
            this.onMessage(parsedData, msg)
        })


    }

    parseMessage(msg: Message) {
        const data = msg.getData()
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'))  
    }
}

class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payments-service';
    onMessage(data: any, msg: Message) {
        console.log('event data!', data)

        msg.ack()
    }
}