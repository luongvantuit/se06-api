import { model, Model, Schema } from "mongoose";

interface IProduct {
    description?: string,
    sid: string,
    displayName?: string,
    photos?: string[],
    address?: string,
}

interface ProductModel extends IProduct, Document {

}

const ProductSchema = new Schema({
    description: { type: String },
    sid: { type: String, },
    displayName: { type: String },
    photos: [{ type: String, default: [] }],
    address: { type: String },
})

const Product: Model<ProductModel> = model<ProductModel>('product', ProductSchema);


export {
    IProduct,
    ProductModel,
    ProductSchema,
}

export default Product;