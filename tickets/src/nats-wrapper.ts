import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
    private _client?: Stan;

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url })

        return new Promise((resolve, reject) => {
            this._client!.on('connect', () => {
                console.log('connected to nats')
                resolve('success')
            })
            this._client!.on('error', (err) => {
                reject(err)
            })
        })

    }

}

export const natsWrapper = new NatsWrapper();