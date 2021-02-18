import nats from 'node-nats-streaming'

console.clear()

/**
 * See readme - need to enable port forwarding or another option for connection to 4222
 */
const stan = nats.connect('ticketing', '123', {
    url: 'http://localhost:4222'
});


stan.on('connect', () => {
    console.log('listener connected to NATS')

    const subscription = stan.subscribe('ticket:created')

    subscription.on('message', (msg) => {
        console.log('message received')
    })
})
