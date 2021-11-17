import { Document, Model, model, Schema } from "mongoose";
import IOrder from "../interfaces/models/IOrder";

interface IOrderModel extends IOrder, Document {

}

const OrderSchema: Schema = new Schema({
    Products: { type: [String] },
    Date: { type: Date },
    Status: { type: Number },
    Expected: { type: Date },
    ShippingUnitID: { type: String },
    Vouchers: { type: [String] },
    Total: { type: Number },
    ProductCost: { type: Number },
    ShippingCost: { type: Number },
    PlaceOfReceipt: { type: String },
    UserID: { type: String },
    ShopOwner: { type: String },
})


const Order: Model<IOrderModel> = model<IOrderModel>('Order', OrderSchema);


export default Order;