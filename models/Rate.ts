import { Document, Model, model, Schema } from "mongoose"

interface Body {
    rate: number,
    message: string,
}

interface IRate {
    uid: string,
    pid: string,
    rateCurrency: number,
    rates: Body[]
}

interface RateModel extends IRate, Document {
}

const RateSchema = new Schema({
    uid: { type: String, required: true },
    pid: { type: String, required: true },
    rateCurrency: { type: Number, required: true },
    rates: [{ rate: Number, message: String, default: [] }],
})

const Rate: Model<RateModel> = model<RateModel>('rate', RateSchema);

export {
    Body,
    IRate,
    RateModel,
    RateSchema,
}

export default Rate;