import { Document, Model, model, Schema } from "mongoose";
import IRate from "../interfaces/models/IRate";

interface IRateModel extends IRate, Document {

}


const RateSchema: Schema = new Schema({
    userId: { type: String },
    rateCurrency: { type: String },
    rates: [{
        rate: Number,
        msg: String,
        date: Date,
    }],
    productID: { type: String },
})

const Rate: Model<IRateModel> = model<IRateModel>('Rate', RateSchema);

export default Rate;