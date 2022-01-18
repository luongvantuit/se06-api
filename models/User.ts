import { model, Model, Schema, Document } from "mongoose"

interface IUser {
    uid: string,
    birthday?: Date,
    displayName?: string,
    displayPhoto?: string,
    displayPhotoCover?: string,
    email?: string,
    bio?: string,
    address?: string
}


interface UserModel extends IUser, Document {

}

const UserSchema = new Schema({
    uid: { type: String, required: true },
    birthday: { type: Date },
    displayName: { type: String },
    displayPhoto: { type: String },
    displayCover: { type: String },
    bio: { type: String },
    email: { type: String, required: true },
    address: { type: String },
})

const User: Model<UserModel> = model<UserModel>('user', UserSchema);

export {
    IUser,
    UserModel,
    UserSchema,
}

export default User;