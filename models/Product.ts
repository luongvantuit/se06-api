import { model, Model, Schema, Document } from "mongoose";

interface IProduct {
    description?: string,
    sid: string,
    displayName?: string,
    photos?: string[],
    address?: string,
    classifies: string[],
    categories?: string[],
    state: string,
    date: Date,
    deleted: boolean
}

interface ProductModel extends IProduct, Document {

}

const ProductSchema = new Schema({
    description: { type: String, required: true },
    sid: { type: String, required: true },
    displayName: { type: String, required: true },
    photos: [{ type: String, required: true, default: [] }],
    address: { type: String },
    classifies: [{ type: String, default: [] }],
    categories: [{ type: String, default: [], enum: ['food', 'other', 'fashion', 'men-s-fashion', 'women-s-fashion', 'sport', 'electronice-device', 'book'] }],
    state: { type: String, enum: ['in-stock', 'out-of-stock'] },
    date: { type: Date },
    deleted: { type: Boolean, default: false }
})

const Product: Model<ProductModel> = model<ProductModel>('product', ProductSchema);


export {
    IProduct,
    ProductModel,
    ProductSchema,
}

export default Product;