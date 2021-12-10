import { model, Model, Schema } from "mongoose";

interface IShop {
    uid: string,
    displayName?: string,
    displayPhoto?: string,
    displayPhotoCover?: string,
    created?: Date,
    discription?: string,
}

interface ShopModel extends IShop, Document {

}

const ShopSchema = new Schema({
    uid: { type: String, required: true },
    displayName: { type: String },
    displayPhoto: { type: String },
    displayPhotoCover: { type: String },
    created: { type: Date },
    discription: { type: String },
})


const Shop: Model<ShopModel> = model<ShopModel>('shop', ShopSchema);


export {
    IShop,
    ShopModel,
    ShopSchema,
}

export default Shop;