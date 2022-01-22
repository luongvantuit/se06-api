import { model, Model, Schema, Document } from "mongoose";

interface IShop {
    uid: string,
    displayName?: string,
    displayPhoto?: string,
    displayPhotoCover?: string,
    created: Date,
    description?: string,
    deleted: boolean
}

interface ShopModel extends IShop, Document {

}

const ShopSchema = new Schema({
    uid: { type: String, required: true },
    displayName: { type: String, required: true },
    displayPhoto: { type: String },
    displayPhotoCover: { type: String },
    created: { type: Date, required: true },
    description: { type: String },
    deleted: { type: Boolean, required: true, default: false }
})


const Shop: Model<ShopModel> = model<ShopModel>('shop', ShopSchema);


export {
    IShop,
    ShopModel,
    ShopSchema,
}

export default Shop;