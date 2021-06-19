import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'

interface TicketAttrs {
    title: string;
    price: string;
}

export interface TicketDoc extends mongoose.Document, TicketAttrs {
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id

        }
    }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
} 

// must use function
ticketSchema.methods.isReserved = async function() {
    // get ticket that has status of created, awaiting, complete to see if ticket is reserved
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }