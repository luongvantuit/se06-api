import { Document, Model, model, Schema } from "mongoose";
import IRate from "../interfaces/models/IRate";

interface IRateModel extends IRate, Document {

}


const RateSchema: Schema = new Schema({
    userID: { type: String },
    message: { type: String },
    rate: { type: Number },
    productID: { type: String },
    date: { type: Date },
})

const Rate: Model<IRateModel> = model<IRateModel>('Rate', RateSchema);

export default Rate;