import { Document, model, Schema, Model } from 'mongoose';

interface ICart {
    pid: string;
    uid: string;
    quantily: number;
    classify?: number;
}

interface CartModel extends ICart, Document {

}

const CartSchema = new Schema({
    uid: { type: String, required: true },
    pid: { type: String, required: true },
    quantily: { type: Number, required: true },
    classify: { type: Number }
});

const Cart: Model<CartModel> = model<CartModel>('cart', CartSchema);

export default Cart;

export {
    ICart,
    CartModel
};