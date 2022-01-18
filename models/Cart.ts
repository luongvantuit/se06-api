import { Document, model, Schema, Model } from 'mongoose';

interface ICart {

}

interface CartModel extends ICart, Document {

}

const CartSchema = new Schema({

});

const Cart: Model<CartModel> = model<CartModel>('cart', CartSchema);

export default Cart;

export {
    ICart,
    CartModel
};