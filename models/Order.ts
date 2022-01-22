import { model, Model, Schema } from "mongoose";


interface Infor {
    pid: string;
    displayName: string;
    photos: string[];
    address: string;
    classify: {
        cid: string;
        price: number,
        displayName: string,
        quantity: number,
        description: string,
    };
}

interface IOrder {
    uid: string,
    status: string,
    date: Date,
    infor: Infor[]
    amount: number
}

interface OrderModel extends Document, IOrder {

}


const OrderSchema = new Schema({
    uid: { type: String, required: true },
    status: { type: String, enum: ['wait-for-confirmation', 'canceled', 'being-transported', 'done', 'delivered'], required: true },
    date: { type: Date },
    infor: [{
        pid: { type: String, required: true },
        displayName: { type: true },
        photos: [{ type: String, required: true }],
        address: { type: String },
        classify: {
            type: {
                cid: { type: String, required: true },
                price: { type: Number, required: true },
                displayName: { type: String, required: true },
                quantity: { type: Number, required: true },
                description: { type: String, required: true },
            },
            required: true
        }
    }]
});


const Order: Model<OrderModel> = model<OrderModel>('order', OrderSchema);


export default Order;

export {
    IOrder,
    OrderModel,
    OrderSchema,
    Infor
}