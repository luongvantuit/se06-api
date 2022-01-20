import { model, Model, Schema, Document } from "mongoose";

interface Classify {
    price: number,
    displayName: string,
    quantily: number,
}


interface IProduct {
    description?: string,
    sid: string,
    displayName?: string,
    photos?: string[],
    address?: string,
    classifies: Classify[],
    categories?: string[],
    state: string,
    date: Date
}

interface ProductModel extends IProduct, Document {

}

const ProductSchema = new Schema({
    description: { type: String, required: true },
    sid: { type: String, required: true },
    displayName: { type: String, required: true },
    photos: [{ type: String, required: true, default: [] }],
    address: { type: String },
    classifies: [{ price: { type: Number, required: true }, displayName: { type: String, required: true }, quantily: { type: Number, required: true }, default: [] }],
    categories: [{ type: String, default: true, enum: ['food', 'other', 'fashion', 'men-s-fashion', 'women-s-fashion', 'sport', 'electronice-device', 'book'] }],
    state: { type: String, enum: ['in-stock', 'out-of-stock'] },
    date: { type: Date }
})

const Product: Model<ProductModel> = model<ProductModel>('product', ProductSchema);


export {
    IProduct,
    ProductModel,
    ProductSchema,
    Classify,
}

export default Product;