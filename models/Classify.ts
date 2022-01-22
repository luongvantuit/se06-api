import { Document, model, Model, Schema } from "mongoose";

interface IClassify {
    price: number,
    displayName: string,
    quantity: number,
    description?: string,
    uid: string,
    sid: string,
    pid: string,
    deleted: boolean
}

interface ClassifyModel extends Document, IClassify {

}

const ClassifyShema = new Schema({
    uid: { type: String, required: true },
    sid: { type: String, required: true },
    price: { type: Number, required: true },
    displayName: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    pid: { type: String, required: true },
    deleted: { type: Boolean, default: false }
})

const Classify: Model<ClassifyModel> = model<ClassifyModel>('classify', ClassifyShema);


export default Classify;

export {
    IClassify,
    ClassifyModel,
    ClassifyShema,
}

