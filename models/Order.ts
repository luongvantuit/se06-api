import { Document, Model, model, Schema } from "mongoose";
import IOrder from "../interfaces/models/IOrder";

interface IOrderModel extends IOrder, Document {

}

const OrderSchema: Schema = new Schema({
    products: { type: [String] },
    date: { type: Date },
    status: { type: Number },
    expected: { type: Date },
    shippingUnitID: { type: String },
    vouchers: { type: [String] },
    total: { type: Number },
    productCost: { type: Number },
    shippingCost: { type: Number },
    placeOfReceipt: { type: String },
    userID: { type: String },
})


const Order: Model<IOrderModel> = model<IOrderModel>('Order', OrderSchema);


export default Order;