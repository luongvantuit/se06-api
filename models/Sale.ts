import { Document, Model, model, Schema } from "mongoose";
import ISale from "../interfaces/models/ISale";

interface ISaleModel extends ISale, Document {

}

const SaleSchema: Schema = new Schema({
    productID: { type: String },
    percentage: { type: Number },
    date: { type: Date },
    expried: { type: Date },
})

const Sale: Model<ISaleModel> = model<ISaleModel>('Sale', SaleSchema);

export default Sale;