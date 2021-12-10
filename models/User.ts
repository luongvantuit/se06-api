import { model, Model, Schema } from "mongoose"

interface Card {
    cardNumber: string,
    cvv: string,
    ownerName: string,
}

interface IUser {
    uid: string,
    birthday?: Date,
    displayName?: string,
    displayPhoto?: string,
    email: string,
    bio?: string,
    cards?: Card[],
    address?: string
}


interface UserModel extends IUser, Document {

}

const UserSchema = new Schema({
    uid: { type: String, required: true },
    birthday: { type: Date },
    displayName: { type: String },
    displayPhoto: { type: String },
    bio: { type: String },
    email: { type: String, required: true },
    cards: [{ cardName: String, cvv: String, ownerName: String, default: [] }],
    address: { type: String },
})

const User: Model<UserModel> = model<UserModel>('user', UserSchema);

export {
    Card,
    IUser,
    UserModel,
    UserSchema,
}

export default User;