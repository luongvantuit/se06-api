import { Document, Model, model, Schema } from "mongoose";
import IDeliverySchedule from "../interfaces/models/IDeliverySchedule";

interface IDeliveryScheduleModel extends IDeliverySchedule, Document {

}

const DeliveryScheduleSchema: Schema = new Schema({
    orderID: { type: String },
    status: { type: String },
    date: { type: Date },
})

const DeliverySchedule: Model<IDeliveryScheduleModel> = model<IDeliveryScheduleModel>('DeliverySchedule', DeliveryScheduleSchema);

export default DeliverySchedule;