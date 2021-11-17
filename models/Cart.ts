import { Document, Model, model, Schema } from "mongoose";
import ICart from "../interfaces/models/ICart";

interface ICartModel extends ICart, Document {

}

const CartSchema: Schema = new Schema({
    UserID: { type: String, required: true },
    ProductID: { type: String, required: true }
})

const Cart: Model<ICartModel> = model<ICartModel>('Cart', CartSchema);

export default Cart;
