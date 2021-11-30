import { Document, Model, model, Schema } from "mongoose";
import ICart from "../interfaces/models/ICart";

interface ICartModel extends ICart, Document {

}

const CartSchema: Schema = new Schema({
    userID: { type: String, required: true },
    productID: { type: String, required: true }
})

const Cart: Model<ICartModel> = model<ICartModel>('Cart', CartSchema);

export default Cart;
