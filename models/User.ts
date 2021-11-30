import IUser from "../interfaces/models/IUser";
import { Document, Schema, model, Model } from "mongoose";

interface IUserModel extends IUser, Document {

}

const UserSchema: Schema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    numberPhone: { type: String },
    uid: { type: String, required: true, unique: true },
    photoURL: { type: String },
    status: { type: Number },
    country: { type: Number },
    birthday: { type: Date },
    bio: { type: String },
})

const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);

export default User;