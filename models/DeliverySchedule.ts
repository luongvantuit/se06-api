import { Document, Model, model, Schema } from "mongoose";
import IDeliverySchedule from "../interfaces/models/IDeliverySchedule";

interface IDeliveryScheduleModel extends IDeliverySchedule, Document {

}

const DeliveryScheduleSchema: Schema = new Schema({
    OrderID: { type: String },
    Status: { type: String },
    ShopOwner: { type: String },
    Date: { type: Date },
})

const DeliverySchedule: Model<IDeliveryScheduleModel> = model<IDeliveryScheduleModel>('DeliverySchedule', DeliveryScheduleSchema);

export default DeliverySchedule;