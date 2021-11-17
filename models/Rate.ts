import { Document, Model, model, Schema } from "mongoose";
import IRate from "../interfaces/models/IRate";

interface IRateModel extends IRate, Document {

}


const RateSchema: Schema = new Schema({
    UserID: { type: String },
    Message: { type: String },
    Rate: { type: Number },
    ProductID: { type: String },
    Date: { type: Date },
})

const Rate: Model<IRateModel> = model<IRateModel>('Rate', RateSchema);

export default Rate;