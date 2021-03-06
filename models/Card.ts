import { model, Model, Schema, Document } from "mongoose";

interface ICard {
    cardNumber: string,
    cvv?: string,
    ownerName: string,
    uid?: string,
}

interface CardModel extends Document, ICard {

}


const CardShema = new Schema({
    cardNumber: { type: String, required: true },
    cvv: { type: String, required: true },
    ownerName: { type: String, required: true },
    uid: { type: String, required: true }
})

const Card: Model<CardModel> = model<CardModel>('card', CardShema);


export {
    ICard,
    CardModel,
    CardShema,
}


export default Card;