import nats from 'node-nats-streaming'

/**
 * See readme - need to enable port forwarding or another option for connection to 4222
 */
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS')

    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    })

    stan.publish('ticket:created', data, () => {
        console.log('event published')
    })
})
