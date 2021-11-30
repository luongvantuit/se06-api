import { Document, Model, model, Schema } from "mongoose";
import IProduct from "../interfaces/models/IProduct";

interface IProductModel extends IProduct, Document {

}

const ProductSchema: Schema = new Schema({
    shopID: { type: String },
    name: { type: String },
    cold: { type: Number },
    address: { type: String },
    price: { type: Number },
    description: { type: String },
    date: { type: Date },
    origin: { type: String },
    category: { type: Number },
    photos: { type: [String] },
})

const Product: Model<IProductModel> = model<IProductModel>('Product', ProductSchema);

export default Product;