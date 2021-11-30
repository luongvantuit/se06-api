import { Document, model, Model, Schema } from "mongoose";
import IBought from "../interfaces/models/IBought";

interface IBoughtModel extends IBought, Document {

}

const BoughtSchema: Schema = new Schema({
    userID: { type: String },
    productID: { type: String }
})


const Bought: Model<IBoughtModel> = model<IBoughtModel>('Bought', BoughtSchema);

export default Bought;