import { Document, model, Schema, Model } from 'mongoose';

interface ICart {

}

interface CartModel extends ICart, Document {

}






export {
    ICart,
    CartModel
}