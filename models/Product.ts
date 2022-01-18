import { model, Model, Schema } from "mongoose";

interface Classify {
    price: number,
    displayName: string,
}


interface IProduct {
    description?: string,
    sid: string,
    displayName?: string,
    photos?: string[],
    address?: string,
    classifies?: Classify[],
    categories?: string[],
}

interface ProductModel extends IProduct, Document {

}

const ProductSchema = new Schema({
    description: { type: String },
    sid: { type: String, },
    displayName: { type: String },
    photos: [{ type: { type: String, required: true }, default: [] }],
    address: { type: String },
    classifies: [{ price: { type: Number, required: true }, displayName: { type: String, required: true }, default: [] }],
    categories: [{ type: String, default: true, enum: ['food', 'other', 'fashion', 'men-s-fashion', 'women-s-fashion', 'sport', 'electronice-device','book'] }]
})

const Product: Model<ProductModel> = model<ProductModel>('product', ProductSchema);


export {
    IProduct,
    ProductModel,
    ProductSchema,
    Classify,
}

export default Product;