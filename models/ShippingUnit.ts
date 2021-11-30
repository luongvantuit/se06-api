import { Document, Model, model, Schema } from "mongoose";
import IShippingUnit from "../interfaces/models/IShippingUnit";

interface IShippingUnitModel extends IShippingUnit, Document {

}


const ShippingUnitSchema: Schema = new Schema({
    name: { type: String },
    price: { type: Number },
})

const ShippingUnit: Model<IShippingUnitModel> = model<IShippingUnitModel>('ShippingUnit', ShippingUnitSchema);

export default ShippingUnit;

