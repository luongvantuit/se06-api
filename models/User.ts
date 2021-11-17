import IUser from "../interfaces/models/IUser";
import { Document, Schema, model, Model } from "mongoose";

interface IUserModel extends IUser, Document {

}

const UserSchema: Schema = new Schema({
    Name: { type: String },
    Email: { type: String, required: true, unique: true },
    NumberPhone: { type: String },
    UID: { type: String, required: true, unique: true },
    URLPhoto: { type: String },
    Status: { type: Number },
    Country: { type: Number },
})

const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);

export default User;