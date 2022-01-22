import { Document, model, Schema, Model } from 'mongoose';

interface ICart {
    pid: string;
    uid: string;
    quantily: number;
    classify: string;
    date: Date
}

interface CartModel extends ICart, Document {

}

const CartSchema = new Schema({
    uid: { type: String, required: true },
    pid: { type: String, required: true },
    quantily: { type: Number, required: true, min: 0 },
    classify: { type: String, required: true },
    date: { type: Date },
});

const Cart: Model<CartModel> = model<CartModel>('cart', CartSchema);

export default Cart;

export {
    ICart,
    CartModel
};