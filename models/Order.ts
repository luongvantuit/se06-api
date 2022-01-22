import { model, Model, Schema } from "mongoose";

interface IOrder {
    uid: string,
    
}

interface OrderModel extends Document, IOrder {

}


const OrderSchema = new Schema({

});


const Order: Model<OrderModel> = model<OrderModel>('order', OrderSchema);


export default Order;

export {
    IOrder,
    OrderModel,
    OrderSchema
}