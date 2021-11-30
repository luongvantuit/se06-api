import { Document, Model, model, Schema } from "mongoose";
import ITag from "../interfaces/models/ITag";

interface ITagModel extends ITag, Document {

}

const TagSchema: Schema = new Schema({
    tag: { type: String },
    productID: { type: String },
})

const Tag: Model<ITagModel> = model<ITagModel>('Tag', TagSchema);

export default Tag;