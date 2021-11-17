import { Document, Model, model, Schema } from "mongoose";
import IShop from "../interfaces/models/IShop";


interface IShopModel extends IShop, Document {

}

const ShopSchema: Schema = new Schema({
    Name: { type: String },
    UserID: { type: String },
})

const Shop: Model<IShopModel> = model<IShopModel>('Shop', ShopSchema);

export default Shop;