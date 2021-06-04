import { Stan, Message } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}
abstract class Listener<T extends Event> {
    
    private client: Stan;
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
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

export default Listener;