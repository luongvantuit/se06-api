import { Document, Model, model, Schema } from "mongoose";
import IProduct from "../interfaces/models/IProduct";

interface IProductModel extends IProduct, Document {

}

const ProductSchema: Schema = new Schema({
    ShopID: { type: String },
    Name: { type: String },
    Cold: { type: Number },
    Address: { type: String },
    Price: { type: Number },
    Description: { type: String },
    Date: { type: Date },
    Origin: { type: String },
    Category: { type: Number },
})

const Product: Model<IProductModel> = model<IProductModel>('Product', ProductSchema);

export default Product;