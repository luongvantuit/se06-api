import { Document, model, Model, Schema } from "mongoose";

interface IClassify {
    price: number,
    displayName: string,
    quantily: number,
    description: string,
    uid: string,
    sid: string,
    pid: string,
}

interface ClassifyModel extends Document, IClassify {

}

const ClassifyShema = new Schema({
    uid: { type: String, required: true },
    sid: { type: String, required: true },
    price: { type: Number, required: true },
    displayName: { type: String, required: true },
    quantily: { type: Number, required: true },
    description: { type: String, required: true },
    pid: { type: String, required: true }
})

const Classify: Model<ClassifyModel> = model<ClassifyModel>('classify', ClassifyShema);


export default Classify;

export {
    IClassify,
    ClassifyModel,
    ClassifyShema,
}

