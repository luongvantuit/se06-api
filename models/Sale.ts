import { Document, Model, model, Schema } from "mongoose";
import ISale from "../interfaces/models/ISale";

interface ISaleModel extends ISale, Document {

}

const SaleSchema: Schema = new Schema({
    ProductID: { type: String },
    Percentage: { type: Number },
    Date: { type: Date },
    Expried: { type: Date },
})

const Sale: Model<ISaleModel> = model<ISaleModel>('Sale', SaleSchema);

export default Sale;